import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { CampusReferral } from '../models/CampusReferral.js';
import { CampusEvent } from '../models/CampusEvent.js';
import { isDbConnected } from '../config/db.js';

const generateToken = (id, role, phone) => {
  return jwt.sign(
    { id, role, phone },
    process.env.JWT_SECRET || 'raahi_jwt_secret_token_key_2026_super_secure',
    { expiresIn: '7d' }
  );
};

// Generate human-friendly referral code e.g. RAAHI-ARJUN26
const generateReferralCode = (name = 'STUDENT') => {
  const clean = name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'RAAHI';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RAAHI-${clean}${rand}`;
};

// Calculate profile completion percentage based on filled fields
const calculateCompletion = (user) => {
  let score = 20; // base account
  if (user.studentProfile?.fullName) score += 10;
  if (user.studentProfile?.college) score += 15;
  if (user.studentProfile?.campus) score += 10;
  if (user.studentProfile?.course) score += 10;
  if (user.studentProfile?.yearOfStudy) score += 10;
  if (user.studentVerification?.status && user.studentVerification.status !== 'NOT_STARTED') score += 15;
  if (user.avatar) score += 5;
  if (user.studentProfile?.linkedin || user.studentProfile?.instagram) score += 5;
  return Math.min(score, 100);
};

// Mask private email for privacy-safe display
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return 'student@raahi.in';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
};

// Mask name for privacy (e.g. "Arjun Sharma" -> "Arjun S.")
const maskName = (name) => {
  if (!name) return 'Student Traveler';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
};

// 1. REGISTER CAMPUS AMBASSADOR
export const registerAmbassador = async (req, res) => {
  try {
    const {
      name,
      email,
      phone = '+91 9876543210',
      password = 'password123',
      college,
      campus,
      course,
      yearOfStudy,
      city = 'Jaipur',
      state = 'Rajasthan',
      expectedGraduationYear,
      collegeEmail,
      linkedin,
      instagram,
      portfolio,
      verificationMethod = 'student_id',
      documentUrl = '',
      documentName = '',
      referredBy = ''
    } = req.body;

    if (!college || !course) {
      return res.status(400).json({
        success: false,
        message: 'College/University and Course are required fields.'
      });
    }

    const uniqueCode = generateReferralCode(name || 'AMB');

    let user;
    if (isDbConnected()) {
      try {
        // Check if existing user by phone or email
        user = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });

        if (user) {
          // Safe upgrade: add campus_ambassador role without duplicate account
          if (!user.roles) user.roles = [user.role];
          if (!user.roles.includes('campus_ambassador')) {
            user.roles.push('campus_ambassador');
          }
          user.role = 'campus_ambassador';
          user.studentProfile = {
            fullName: name || user.name,
            college,
            campus: campus || city,
            city,
            state,
            course,
            yearOfStudy: yearOfStudy || '1st Year',
            expectedGraduationYear: expectedGraduationYear || '2027',
            collegeEmail,
            linkedin,
            instagram,
            portfolio
          };
          user.studentVerification = {
            status: documentUrl || collegeEmail ? 'SUBMITTED' : 'NOT_STARTED',
            method: verificationMethod,
            documentUrl,
            documentName: documentName || (documentUrl ? 'Student_ID_Proof.pdf' : ''),
            submittedAt: documentUrl || collegeEmail ? new Date() : null
          };
          user.campusAmbassadorProfile = {
            referralCode: user.campusAmbassadorProfile?.referralCode || uniqueCode,
            campusReach: user.campusAmbassadorProfile?.campusReach || 0,
            profileViews: user.campusAmbassadorProfile?.profileViews || 0,
            ambassadorStatus: 'ACTIVE',
            joinedDate: user.campusAmbassadorProfile?.joinedDate || new Date(),
            profileCompletionPercentage: calculateCompletion({ studentProfile: user.studentProfile, studentVerification: user.studentVerification })
          };
          user.referralCode = user.campusAmbassadorProfile.referralCode;
          if (referredBy) user.referredBy = referredBy;

          await user.save();
        } else {
          // Create new user
          user = await User.create({
            name: name || 'Student Ambassador',
            email,
            phone,
            password,
            role: 'campus_ambassador',
            roles: ['campus_ambassador'],
            city: city || 'Jaipur',
            verified: false,
            studentProfile: {
              fullName: name,
              college,
              campus: campus || city,
              city,
              state,
              course,
              yearOfStudy: yearOfStudy || '1st Year',
              expectedGraduationYear: expectedGraduationYear || '2027',
              collegeEmail,
              linkedin,
              instagram,
              portfolio
            },
            studentVerification: {
              status: documentUrl || collegeEmail ? 'SUBMITTED' : 'NOT_STARTED',
              method: verificationMethod,
              documentUrl,
              documentName: documentName || (documentUrl ? 'Student_ID_Proof.pdf' : ''),
              submittedAt: documentUrl || collegeEmail ? new Date() : null
            },
            campusAmbassadorProfile: {
              referralCode: uniqueCode,
              campusReach: 0,
              profileViews: 0,
              ambassadorStatus: 'ACTIVE',
              joinedDate: new Date(),
              profileCompletionPercentage: 85
            },
            referralCode: uniqueCode,
            referredBy: referredBy || ''
          });
        }

        // If referred by another ambassador, track registration
        if (referredBy) {
          const referrer = await User.findOne({
            $or: [{ referralCode: referredBy }, { 'campusAmbassadorProfile.referralCode': referredBy }]
          });
          if (referrer) {
            await CampusReferral.create({
              ambassadorId: referrer._id,
              referralCode: referredBy,
              referredUserId: user._id,
              studentName: user.name,
              studentEmail: user.email || '',
              status: 'REGISTERED',
              registeredAt: new Date()
            });
          }
        }
      } catch (err) {
        console.warn('MongoDB ambassador register fallback:', err.message);
      }
    }

    // In-memory fallback if DB not connected
    if (!user) {
      const mockId = `amb_${Date.now()}`;
      user = {
        _id: mockId,
        id: mockId,
        name: name || 'Student Ambassador',
        email,
        phone,
        role: 'campus_ambassador',
        roles: ['campus_ambassador'],
        city,
        verified: false,
        studentProfile: {
          fullName: name,
          college,
          campus: campus || city,
          city,
          state,
          course,
          yearOfStudy: yearOfStudy || '2nd Year',
          expectedGraduationYear: expectedGraduationYear || '2027',
          collegeEmail,
          linkedin,
          instagram,
          portfolio
        },
        studentVerification: {
          status: documentUrl || collegeEmail ? 'SUBMITTED' : 'NOT_STARTED',
          method: verificationMethod,
          documentUrl,
          documentName: documentName || 'Student_ID.pdf',
          submittedAt: new Date()
        },
        campusAmbassadorProfile: {
          referralCode: uniqueCode,
          campusReach: 0,
          profileViews: 0,
          ambassadorStatus: 'ACTIVE',
          joinedDate: new Date(),
          profileCompletionPercentage: 85
        },
        referralCode: uniqueCode
      };
    }

    const token = generateToken(user._id || user.id, user.role, user.phone);

    return res.status(201).json({
      success: true,
      message: 'Campus Ambassador profile registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error in registerAmbassador:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET AMBASSADOR DASHBOARD DATA
export const getAmbassadorDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let user;
    let reachCount = 0;
    let referralsCount = 0;
    let registeredCount = 0;
    let verifiedStudentsCount = 0;
    let campusEventsCount = 0;

    if (isDbConnected()) {
      try {
        user = await User.findById(userId);

        if (user) {
          const ambCode = user.campusAmbassadorProfile?.referralCode || user.referralCode;

          // Real database stats - strictly NO fake numbers
          reachCount = await CampusReferral.countDocuments({ ambassadorId: user._id });
          referralsCount = await CampusReferral.countDocuments({
            ambassadorId: user._id,
            status: { $in: ['REGISTERED', 'VERIFICATION_PENDING', 'VERIFIED'] }
          });
          registeredCount = await CampusReferral.countDocuments({
            ambassadorId: user._id,
            status: { $in: ['REGISTERED', 'VERIFICATION_PENDING', 'VERIFIED'] }
          });
          verifiedStudentsCount = await CampusReferral.countDocuments({
            ambassadorId: user._id,
            status: 'VERIFIED'
          });

          // Campus Events count
          campusEventsCount = await CampusEvent.countDocuments({
            status: 'UPCOMING'
          });
        }
      } catch (err) {
        console.warn('Dashboard DB query fallback:', err.message);
      }
    }

    // Fallback if demo user without DB
    if (!user) {
      user = {
        _id: userId,
        name: req.user?.name || 'Arjun Sharma',
        role: 'campus_ambassador',
        studentProfile: {
          fullName: req.user?.name || 'Arjun Sharma',
          college: 'Poornima University',
          campus: 'Jaipur',
          city: 'Jaipur',
          course: 'B.Tech CSE',
          yearOfStudy: '2nd Year',
          expectedGraduationYear: '2027'
        },
        studentVerification: {
          status: 'UNDER_REVIEW',
          method: 'student_id',
          submittedAt: new Date()
        },
        campusAmbassadorProfile: {
          referralCode: 'RAAHI-ARJUN26',
          campusReach: 0,
          profileViews: 0,
          ambassadorStatus: 'ACTIVE',
          joinedDate: new Date('2026-09-01'),
          profileCompletionPercentage: 85
        }
      };
    }

    const refCode = user.campusAmbassadorProfile?.referralCode || user.referralCode || 'RAAHI-CAMPUS';
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const referralLink = `${baseUrl}/register?ref=${refCode}`;

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user._id,
          name: user.studentProfile?.fullName || user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          roles: user.roles || [user.role],
          college: user.studentProfile?.college || 'University',
          campus: user.studentProfile?.campus || 'Main Campus',
          city: user.studentProfile?.city || 'Jaipur',
          course: user.studentProfile?.course || 'Undergraduate',
          yearOfStudy: user.studentProfile?.yearOfStudy || '1st Year',
          expectedGraduationYear: user.studentProfile?.expectedGraduationYear || '2027',
          verificationStatus: user.studentVerification?.status || 'NOT_STARTED',
          verificationMethod: user.studentVerification?.method || 'student_id',
          reviewerNotes: user.studentVerification?.reviewerNotes || '',
          joinedDate: user.campusAmbassadorProfile?.joinedDate || user.createdAt,
          completionPercentage: calculateCompletion(user),
          referralCode: refCode,
          referralLink
        },
        stats: {
          campusReach: reachCount,
          referrals: referralsCount,
          registeredStudents: registeredCount,
          verifiedStudents: verifiedStudentsCount,
          events: campusEventsCount,
          profileViews: user.campusAmbassadorProfile?.profileViews || 0
        }
      }
    });
  } catch (error) {
    console.error('Error in getAmbassadorDashboard:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET AMBASSADOR REFERRALS (Privacy Safe)
export const getAmbassadorReferrals = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let referrals = [];
    if (isDbConnected()) {
      try {
        const docs = await CampusReferral.find({ ambassadorId: userId })
          .sort({ createdAt: -1 })
          .limit(50);

        referrals = docs.map((doc) => ({
          id: doc._id,
          student: maskName(doc.studentName),
          email: maskEmail(doc.studentEmail),
          status: doc.status,
          joined: doc.registeredAt || doc.createdAt,
          verification: doc.status === 'VERIFIED' ? 'Verified' : doc.status === 'REGISTERED' ? 'Verification Pending' : 'Link Clicked'
        }));
      } catch (err) {
        console.warn('DB referrals fetch fallback:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        total: referrals.length,
        referrals
      }
    });
  } catch (error) {
    console.error('Error in getAmbassadorReferrals:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. TRACK REFERRAL CLICK
export const trackReferralClick = async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) {
      return res.status(400).json({ success: false, message: 'Referral code is required' });
    }

    let ambassador = null;
    if (isDbConnected()) {
      try {
        ambassador = await User.findOne({
          $or: [
            { referralCode: referralCode.toUpperCase() },
            { 'campusAmbassadorProfile.referralCode': referralCode.toUpperCase() }
          ]
        });

        if (ambassador) {
          // Increment campus reach counter
          await User.findByIdAndUpdate(ambassador._id, {
            $inc: { 'campusAmbassadorProfile.campusReach': 1 }
          });

          // Record click event
          await CampusReferral.create({
            ambassadorId: ambassador._id,
            referralCode: referralCode.toUpperCase(),
            status: 'CLICKED',
            clickedAt: new Date()
          });
        }
      } catch (err) {
        console.warn('Track referral click DB fallback:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      valid: !!ambassador,
      ambassadorName: ambassador ? maskName(ambassador.name) : null,
      college: ambassador?.studentProfile?.college || null
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. SUBMIT STUDENT VERIFICATION
export const submitStudentVerification = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { method = 'student_id', documentUrl = '', documentName = '', collegeEmail = '' } = req.body;

    let user;
    if (isDbConnected()) {
      try {
        user = await User.findById(userId);
        if (user) {
          user.studentVerification = {
            status: 'UNDER_REVIEW', // Never auto-verify simply because an ID was uploaded
            method,
            documentUrl: documentUrl || user.studentVerification?.documentUrl || '',
            documentName: documentName || user.studentVerification?.documentName || 'Student_ID_Proof.pdf',
            submittedAt: new Date(),
            reviewerNotes: 'Document submitted for administrative verification'
          };
          if (collegeEmail && user.studentProfile) {
            user.studentProfile.collegeEmail = collegeEmail;
          }
          await user.save();
        }
      } catch (err) {
        console.warn('Student verification submit DB fallback:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Student verification submitted for review. An administrator will review your credentials.',
      data: {
        status: 'UNDER_REVIEW',
        method,
        submittedAt: new Date()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. GET CAMPUS EVENTS
export const getCampusEvents = async (req, res) => {
  try {
    let events = [];
    if (isDbConnected()) {
      try {
        events = await CampusEvent.find({ status: { $ne: 'CANCELLED' } }).sort({ date: 1 });
      } catch (err) {
        console.warn('Campus events DB fallback:', err.message);
      }
    }

    // Default real preview event if none in DB
    if (events.length === 0) {
      events = [
        {
          _id: 'ev_jaipur_01',
          title: 'RAAHI Campus Meetup & Travel Leadership Summit',
          campus: 'Jaipur Campuses',
          city: 'Jaipur',
          date: 'Coming Soon — Autumn 2026',
          time: '04:00 PM — 06:30 PM',
          venue: 'Auditorium Hall, Jaipur Cultural Hub',
          description: 'Connect with fellow student ambassadors, learn safe cultural storytelling, and explore upcoming youth travel grants.',
          status: 'UPCOMING',
          registrationUrl: '#'
        }
      ];
    }

    return res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. UPGRADE TO LOCAL HOST (Clear role separation)
export const upgradeToLocalHost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let user;

    if (isDbConnected()) {
      user = await User.findById(userId);
      if (user) {
        if (!user.roles) user.roles = [user.role];
        if (!user.roles.includes('local_host')) {
          user.roles.push('local_host');
        }
        user.role = 'guide'; // Guide/Local Host capability
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Local Host capability requested. Please complete local host onboarding details.',
      data: user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. ADMIN: GET ALL AMBASSADORS
export const getAdminAmbassadors = async (req, res) => {
  try {
    let ambassadors = [];
    if (isDbConnected()) {
      try {
        ambassadors = await User.find({
          $or: [{ role: 'campus_ambassador' }, { roles: 'campus_ambassador' }]
        }).select('-password').sort({ createdAt: -1 });
      } catch (err) {
        console.warn('Admin ambassadors DB fallback:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: ambassadors
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. ADMIN: REVIEW AND UPDATE VERIFICATION STATUS
export const adminUpdateVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verificationStatus, ambassadorStatus, reviewerNotes } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Ambassador not found' });
      }

      if (verificationStatus) {
        if (!user.studentVerification) user.studentVerification = {};
        user.studentVerification.status = verificationStatus;
        user.studentVerification.reviewedAt = new Date();
        if (reviewerNotes) user.studentVerification.reviewerNotes = reviewerNotes;

        // If verified, update referrals status as well
        if (verificationStatus === 'VERIFIED') {
          await CampusReferral.updateMany(
            { referredUserId: user._id },
            { status: 'VERIFIED', verifiedAt: new Date() }
          );
        }
      }

      if (ambassadorStatus && user.campusAmbassadorProfile) {
        user.campusAmbassadorProfile.ambassadorStatus = ambassadorStatus;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Ambassador status updated to ${verificationStatus || ambassadorStatus}`,
        data: user
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated (in-memory mode)'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

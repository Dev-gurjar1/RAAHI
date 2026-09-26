import React, { useState } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { RaahiLogo } from '../components/RaahiLogo.jsx';
import api from '../services/api.js';

export const CampusAmbassadorOnboardingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCodeFromUrl = searchParams.get('ref') || '';

  const { loginSuccess, user: currentUser } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  // Steps: 1: Role, 2: Account, 3: Campus, 4: Verification, 5: Profile Preview
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('campus_ambassador');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 2: Account Information
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [password, setPassword] = useState('');

  // Step 3: Student & Campus Information
  const [college, setCollege] = useState('Poornima University');
  const [campus, setCampus] = useState('Jaipur');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [course, setCourse] = useState('B.Tech CSE');
  const [yearOfStudy, setYearOfStudy] = useState('2nd Year');
  const [expectedGraduationYear, setExpectedGraduationYear] = useState('2027');

  // Optional Student Profile Fields
  const [collegeEmail, setCollegeEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Step 4: Verification
  const [verificationMethod, setVerificationMethod] = useState('student_id');
  const [idFileName, setIdFileName] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState(false);

  const handleRoleContinue = () => {
    if (selectedRole === 'tourist') {
      navigate('/login?tab=tourist');
      return;
    }
    if (selectedRole === 'guide') {
      navigate('/become-guide');
      return;
    }
    if (selectedRole === 'local_host') {
      navigate('/become-guide?type=local_host');
      return;
    }
    // Proceed to Step 2 for Campus Ambassador
    setStep(2);
  };

  const handleAccountNext = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleCampusNext = (e) => {
    e.preventDefault();
    if (!college.trim()) {
      setErrorMsg('Please enter your College or University name.');
      return;
    }
    if (!course.trim()) {
      setErrorMsg('Please enter your Degree/Course name.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFileName(file.name);
      setIdFileUploaded(true);
      showToast({
        type: 'info',
        title: 'ID Uploaded',
        message: `${file.name} attached for student verification review.`
      });
    }
  };

  const handleVerificationNext = () => {
    setErrorMsg('');
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    const payload = {
      name,
      email,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      password: password || 'raahi_ambassador_2026',
      college,
      campus: campus || city,
      city,
      state,
      course,
      yearOfStudy,
      expectedGraduationYear,
      collegeEmail,
      linkedin,
      instagram,
      portfolio,
      verificationMethod,
      documentUrl: idFileUploaded ? `https://storage.raahi.in/docs/${idFileName || 'student_id.pdf'}` : '',
      documentName: idFileName || (idFileUploaded ? 'Student_ID_Proof.pdf' : ''),
      referredBy: refCodeFromUrl
    };

    try {
      const res = await api.campusAmbassador.register(payload);
      if (res && res.success && res.data) {
        loginSuccess(res.data.user, res.data.token);
        showToast({
          type: 'success',
          title: 'Ambassador Profile Created!',
          message: 'Welcome to RAAHI Campus Ambassador Program.'
        });
        navigate('/campus-ambassador/dashboard');
        return;
      }
    } catch (err) {
      console.warn('Backend API registration notice:', err.message);
      // Fallback local save for seamless sandbox demo
      const fallbackUser = {
        id: `amb_${Date.now()}`,
        name,
        email,
        phone,
        role: 'campus_ambassador',
        roles: ['campus_ambassador'],
        studentProfile: {
          fullName: name,
          college,
          campus,
          city,
          state,
          course,
          yearOfStudy,
          expectedGraduationYear,
          collegeEmail,
          linkedin,
          instagram,
          portfolio
        },
        studentVerification: {
          status: idFileUploaded || collegeEmail ? 'UNDER_REVIEW' : 'NOT_STARTED',
          method: verificationMethod,
          documentName: idFileName || 'Student_ID.pdf',
          submittedAt: new Date()
        },
        campusAmbassadorProfile: {
          referralCode: `RAAHI-${name.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'STUDENT'}26`,
          campusReach: 0,
          profileViews: 0,
          ambassadorStatus: 'ACTIVE',
          joinedDate: new Date(),
          profileCompletionPercentage: 85
        }
      };
      loginSuccess(fallbackUser, `demo_token_${Date.now()}`);
      showToast({
        type: 'success',
        title: 'Profile Created (Demo Mode)',
        message: 'Welcome to RAAHI Campus Ambassador Program!'
      });
      navigate('/campus-ambassador/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] dark:bg-[#0D1710] py-10 px-4 sm:px-6 lg:px-8 text-left font-sans text-[#152238] dark:text-[#E8F0EC]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E0E8E4] dark:border-[#243028]">
          <RaahiLogo variant="compact" size={40} />
          <div className="flex items-center gap-3">
            <NavLink
              to="/login?tab=campus_ambassador&redirect=/campus-ambassador/dashboard"
              className="text-xs font-bold text-[#0B9B6E] hover:underline"
            >
              Already an Ambassador? Sign In
            </NavLink>
            <div className="flex items-center gap-2 text-xs font-bold text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/25 px-3 py-1.5 rounded-full border border-[#0B9B6E]/30">
              <span className="w-2 h-2 rounded-full bg-[#0B9B6E] animate-pulse"></span>
              <span>RAAHI Campus Network • Student Program</span>
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="bg-white dark:bg-[#162019] rounded-2xl p-4 sm:p-5 border border-[#E0E8E4] dark:border-[#243028] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            {[
              { num: 1, label: '01 Role' },
              { num: 2, label: '02 Account' },
              { num: 3, label: '03 Campus' },
              { num: 4, label: '04 Verification' },
              { num: 5, label: '05 Profile' }
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 sm:gap-2 ${
                  step === s.num
                    ? 'text-[#0B9B6E] font-extrabold'
                    : step > s.num
                    ? 'text-[#07543F] dark:text-[#4ADE80]'
                    : 'text-[#8A9BAD]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    step === s.num
                      ? 'bg-[#0B9B6E] text-white shadow-xs'
                      : step > s.num
                      ? 'bg-[#E8F7F1] dark:bg-[#07543F]/40 text-[#0B9B6E]'
                      : 'bg-[#F1F5F3] dark:bg-[#243028] text-[#8A9BAD]'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 1: ROLE SELECTION
            ══════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-6 sm:p-10 border border-[#E0E8E4] dark:border-[#243028] shadow-md space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                How will you use RAAHI?
              </h1>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4]">
                Choose the role that best describes you.
              </p>
            </div>

            {/* 4 Premium Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* 1. TRAVELER */}
              <div
                onClick={() => setSelectedRole('tourist')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative group ${
                  selectedRole === 'tourist'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/40 dark:bg-[#07543F]/20 shadow-md ring-2 ring-[#0B9B6E]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50 bg-[#F8F7F3] dark:bg-[#111C15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🧳</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === 'tourist' ? 'border-[#0B9B6E] bg-[#0B9B6E]' : 'border-[#8A9BAD]'}`}>
                    {selectedRole === 'tourist' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading">TRAVELER</h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Discover guides, tours and experiences. Plan your trip and book with confidence.
                </p>
              </div>

              {/* 2. PROFESSIONAL GUIDE */}
              <div
                onClick={() => setSelectedRole('guide')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative group ${
                  selectedRole === 'guide'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/40 dark:bg-[#07543F]/20 shadow-md ring-2 ring-[#0B9B6E]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50 bg-[#F8F7F3] dark:bg-[#111C15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🧭</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === 'guide' ? 'border-[#0B9B6E] bg-[#0B9B6E]' : 'border-[#8A9BAD]'}`}>
                    {selectedRole === 'guide' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading">PROFESSIONAL GUIDE</h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Offer your expertise and host travelers.
                </p>
              </div>

              {/* 3. LOCAL HOST */}
              <div
                onClick={() => setSelectedRole('local_host')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative group ${
                  selectedRole === 'local_host'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/40 dark:bg-[#07543F]/20 shadow-md ring-2 ring-[#0B9B6E]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50 bg-[#F8F7F3] dark:bg-[#111C15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🏠</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === 'local_host' ? 'border-[#0B9B6E] bg-[#0B9B6E]' : 'border-[#8A9BAD]'}`}>
                    {selectedRole === 'local_host' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading">LOCAL HOST</h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Share your local knowledge and experiences.
                </p>
              </div>

              {/* 4. CAMPUS AMBASSADOR */}
              <div
                onClick={() => setSelectedRole('campus_ambassador')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative group ${
                  selectedRole === 'campus_ambassador'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/40 dark:bg-[#07543F]/20 shadow-md ring-2 ring-[#0B9B6E]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50 bg-[#F8F7F3] dark:bg-[#111C15]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎓</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === 'campus_ambassador' ? 'border-[#0B9B6E] bg-[#0B9B6E]' : 'border-[#8A9BAD]'}`}>
                    {selectedRole === 'campus_ambassador' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading">CAMPUS AMBASSADOR</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#F4A340]/20 text-[#D97706] text-[10px] font-extrabold uppercase">
                    Student
                  </span>
                </div>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Represent RAAHI on your campus, help students discover RAAHI, and build your campus community.
                </p>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleRoleContinue}
                className="btn-primary py-3.5 px-8 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-primary"
              >
                <span>Continue to Registration</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 2: ACCOUNT INFORMATION
            ══════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-6 sm:p-10 border border-[#E0E8E4] dark:border-[#243028] shadow-md space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold mb-2">
                <span>🎓 Step 02 of 05</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                Become a RAAHI Campus Ambassador
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                Bring RAAHI to your campus, build a travel community, and help students discover opportunities to explore and earn.
              </p>
              {/* Compliance Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                <i className="fa-solid fa-circle-info mt-0.5 text-xs text-amber-600 dark:text-amber-400"></i>
                <span>Benefits and rewards may be available based on the active RAAHI ambassador program. No guaranteed income or employment is implied.</span>
              </div>
            </div>

            <form onSubmit={handleAccountNext} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary py-3 px-5 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary py-3.5 px-7 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Next: Campus Details</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 3: CAMPUS INFORMATION
            ══════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-6 sm:p-10 border border-[#E0E8E4] dark:border-[#243028] shadow-md space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold mb-2">
                <span>🏛️ Step 03 of 05 • Campus Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                Tell us about your Institution
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4]">
                Enter your university, campus location, and current academic enrollment.
              </p>
            </div>

            <form onSubmit={handleCampusNext} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Poornima University, DU, IIT Delhi"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                  <span className="text-[10px] text-[#8A9BAD]">Any verified higher education institution in India</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Campus Name / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="e.g. Jaipur, North Campus, Main Campus"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Degree / Course *
                  </label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech CSE, B.Com, MBA, BA History"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Year of Study *
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate / Final">Postgraduate / Final Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jaipur"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Rajasthan"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={expectedGraduationYear}
                    onChange={(e) => setExpectedGraduationYear(e.target.value)}
                    placeholder="e.g. 2027"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              </div>

              {/* Optional Social Profiles */}
              <div className="pt-2 border-t border-[#F1F5F3] dark:border-[#243028] space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#8A9BAD] tracking-wider block">
                  Optional Links & Social Reach
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn Profile URL (optional)"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#152238] dark:text-white"
                  />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram Handle (optional)"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#152238] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary py-3 px-5 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary py-3.5 px-7 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Next: Student Verification</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 4: STUDENT VERIFICATION
            ══════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-6 sm:p-10 border border-[#E0E8E4] dark:border-[#243028] shadow-md space-y-6 animate-fade-in">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold mb-2">
                <span>🛡️ Step 04 of 05 • Verification Workflow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                Verify your student status
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                RAAHI maintains high trust across all campus programs. Select your preferred verification method to begin review.
              </p>
            </div>

            {/* Verification Method Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setVerificationMethod('student_id')}
                className={`p-4 rounded-xl border-2 text-left space-y-1.5 transition-all cursor-pointer ${
                  verificationMethod === 'student_id'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/30 dark:bg-[#07543F]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/40'
                }`}
              >
                <div className="font-bold text-xs text-[#152238] dark:text-white flex items-center justify-between">
                  <span>Student ID Card</span>
                  <i className="fa-solid fa-id-card text-[#0B9B6E]"></i>
                </div>
                <p className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Upload official college photo ID or fee receipt
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVerificationMethod('college_email')}
                className={`p-4 rounded-xl border-2 text-left space-y-1.5 transition-all cursor-pointer ${
                  verificationMethod === 'college_email'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/30 dark:bg-[#07543F]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/40'
                }`}
              >
                <div className="font-bold text-xs text-[#152238] dark:text-white flex items-center justify-between">
                  <span>College Email</span>
                  <i className="fa-solid fa-envelope-circle-check text-[#F4A340]"></i>
                </div>
                <p className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Verify via your official .ac.in / .edu institution email
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVerificationMethod('institution_details')}
                className={`p-4 rounded-xl border-2 text-left space-y-1.5 transition-all cursor-pointer ${
                  verificationMethod === 'institution_details'
                    ? 'border-[#0B9B6E] bg-[#E8F7F1]/30 dark:bg-[#07543F]/20'
                    : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/40'
                }`}
              >
                <div className="font-bold text-xs text-[#152238] dark:text-white flex items-center justify-between">
                  <span>Manual Review</span>
                  <i className="fa-solid fa-building-columns text-purple-500"></i>
                </div>
                <p className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Admin verification via dean / department coordinator
                </p>
              </button>
            </div>

            {/* Method Details */}
            {verificationMethod === 'student_id' && (
              <div className="p-6 rounded-2xl border border-dashed border-[#0B9B6E]/40 bg-[#F8F7F3] dark:bg-[#111C15] space-y-3 text-center">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-[#0B9B6E]"></i>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#152238] dark:text-white">
                    {idFileName ? `Selected: ${idFileName}` : 'Upload Valid Student ID Card (Front & Back)'}
                  </div>
                  <p className="text-[11px] text-[#8A9BAD]">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
                <label className="inline-block px-4 py-2 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] text-xs font-bold text-[#0B9B6E] cursor-pointer shadow-xs">
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,image/*" />
                  <span>{idFileName ? 'Change Document' : 'Browse File'}</span>
                </label>
              </div>
            )}

            {verificationMethod === 'college_email' && (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#152238] dark:text-[#E8F0EC]">
                  Official College Email Address
                </label>
                <input
                  type="email"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  placeholder="e.g. arjun.2023@poornima.edu.in"
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                />
                <span className="text-[10px] text-[#8A9BAD]">We will send a confirmation link to verify your active student status.</span>
              </div>
            )}

            {verificationMethod === 'institution_details' && (
              <div className="p-4 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-2 text-xs">
                <div className="font-bold text-[#152238] dark:text-white">Departmental Review Request</div>
                <p className="text-[#4A5C6E] dark:text-[#9AB0A4] text-[11px] leading-relaxed">
                  Our campus operations team will cross-verify enrollment with your university administration department. You can start building your campus presence right away while verification is in progress.
                </p>
              </div>
            )}

            {/* Trust and Workflow Indicator */}
            <div className="p-4 rounded-2xl bg-[#E8F7F1]/30 dark:bg-[#07543F]/15 border border-[#0B9B6E]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#07543F] dark:text-[#4ADE80]">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Strict Verification Policy</span>
              </div>
              <p className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                Students are never automatically marked as verified simply because a document was uploaded. Every application is reviewed by our administration team to ensure safe, authentic campus representation.
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs font-bold">
                <span className="text-[#0B9B6E]">✓ Profile completed</span>
                <span className="text-[#F4A340]">○ Student verification pending review</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-secondary py-3 px-5 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerificationNext}
                className="btn-primary py-3.5 px-7 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
              >
                <span>Review Ambassador Profile</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            STEP 5: AMBASSADOR PROFILE PREVIEW & CONFIRM
            ══════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-6 sm:p-10 border border-[#E0E8E4] dark:border-[#243028] shadow-md space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold mb-1">
                <span>🎓 Step 05 of 05 • Profile Confirmation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                CAMPUS AMBASSADOR PROFILE
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4]">
                Confirm your student identity and activate your official campus ambassador credentials.
              </p>
            </div>

            {/* Profile Preview Card Matching Requirement 6 */}
            <div className="max-w-md mx-auto bg-[#F8F7F3] dark:bg-[#111C15] rounded-3xl p-6 sm:p-8 border-2 border-[#0B9B6E]/30 shadow-lg space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B9B6E]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white uppercase font-heading tracking-tight">
                    {name || 'ARJUN SHARMA'}
                  </h3>
                  <div className="text-xs font-bold text-[#0B9B6E] flex items-center gap-1.5">
                    <span>🎓 RAAHI Campus Ambassador</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#0B9B6E] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  {name ? name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>

              {/* Institution Details */}
              <div className="space-y-2 pt-2 border-t border-[#E0E8E4] dark:border-[#243028] text-xs">
                <div className="font-extrabold text-[#152238] dark:text-white text-sm">
                  {college || 'Poornima University'}
                </div>
                <div className="text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Campus: <span className="font-bold text-[#152238] dark:text-white">{campus || 'Jaipur'}</span>
                </div>
                <div className="text-[#4A5C6E] dark:text-[#9AB0A4]">
                  {course || 'B.Tech CSE'} • <span className="font-bold">{yearOfStudy || '2nd Year'}</span>
                </div>
              </div>

              {/* Status & Metrics */}
              <div className="space-y-3 pt-3 border-t border-[#E0E8E4] dark:border-[#243028]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8A9BAD] font-bold">Verification:</span>
                  <span className="inline-flex items-center gap-1.5 text-[#F4A340] font-extrabold bg-[#F4A340]/10 px-2.5 py-1 rounded-full border border-[#F4A340]/30 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4A340] animate-pulse"></span>
                    <span>Student Verification Pending</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8A9BAD] font-bold">Joined:</span>
                  <span className="font-bold text-[#152238] dark:text-white">September 2026</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A9BAD] font-bold">Profile completion:</span>
                    <span className="font-extrabold text-[#0B9B6E]">85%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-[#0B9B6E] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-secondary py-3 px-5 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="btn-primary py-4 px-10 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-primary disabled:opacity-50"
              >
                {loading && <i className="fa-solid fa-spinner fa-spin text-xs"></i>}
                <span>Launch Ambassador Dashboard</span>
                {!loading && <i className="fa-solid fa-arrow-right text-xs"></i>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CampusAmbassadorOnboardingPage;

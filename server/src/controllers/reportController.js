import { ScamReport } from '../models/ScamReport.js';

export const createScamReport = async (req, res) => {
  try {
    const reportData = req.body;
    const reportId = `rep_${Date.now()}`;

    const newReport = {
      reportId,
      userId: reportData.userId || 'usr_demo',
      userName: reportData.userName || 'Tourist',
      category: reportData.category || 'Overcharging',
      expectedFare: Number(reportData.expectedFare) || 100,
      chargedFare: Number(reportData.chargedFare) || 200,
      description: reportData.description || 'Driver overcharged beyond benchmark fare.',
      locationDetails: reportData.locationDetails || 'Hawa Mahal, Jaipur',
      status: 'submitted'
    };

    let savedReport;
    try {
      savedReport = await ScamReport.create(newReport);
    } catch (err) {
      console.warn('MongoDB create scam report fallback:', err.message);
      savedReport = newReport;
    }

    return res.status(201).json({
      success: true,
      message: 'Scam report logged. Demo safety team dispatched.',
      data: {
        ...newReport,
        id: reportId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getScamReports = async (req, res) => {
  try {
    let reports;
    try {
      reports = await ScamReport.find().sort({ createdAt: -1 }).lean();
    } catch (err) {
      reports = [];
    }

    return res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import express from 'express';
import { createScamReport, getScamReports } from '../controllers/reportController.js';

const router = express.Router();

router.post('/scam', createScamReport);
router.get('/scam', getScamReports);

export default router;

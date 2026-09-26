import express from 'express';
import { calculateFairPrice, getBenchmarks } from '../controllers/fairPriceController.js';

const router = express.Router();

// Support both /check and /calculate
router.post('/check', calculateFairPrice);
router.post('/calculate', calculateFairPrice);

// Support both /benchmark and /benchmarks
router.get('/benchmark', getBenchmarks);
router.get('/benchmarks', getBenchmarks);

export default router;

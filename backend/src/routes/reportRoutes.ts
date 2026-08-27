import express from 'express';
import { ReportController } from '../controllers/reportController';

const router = express.Router();
const reportController = new ReportController();

// Generate PDF report for a plot
router.get('/plot/:id/pdf', reportController.generatePDFReport);

// Generate CSV report for a plot
router.get('/plot/:id/csv', reportController.generateCSVReport);

// Generate regional summary report
router.get('/regional/pdf', reportController.generateRegionalReport);

export default router;

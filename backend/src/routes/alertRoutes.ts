import express from 'express';
import { AlertController } from '../controllers/alertController';

const router = express.Router();
const alertController = new AlertController();

// Get alerts for a specific plot
router.get('/plot/:plotId', alertController.getPlotAlerts);

// Get alerts for a specific farmer
router.get('/farmer/:farmerId', alertController.getFarmerAlerts);

// Get all alerts (with filtering by region for officers)
router.get('/', alertController.getAllAlerts);

// Mark alert as resolved
router.put('/:id/resolve', alertController.resolveAlert);

// Create manual alert
router.post('/', alertController.createAlert);

export default router;

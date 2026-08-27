import express from 'express';
import { PlotController } from '../controllers/plotController';

const router = express.Router();
const plotController = new PlotController();

// Register a new plot
router.post('/register', plotController.registerPlot);

// Get all plots for a farmer
router.get('/farmer/:farmerId', plotController.getFarmerPlots);

// Get specific plot details
router.get('/:id', plotController.getPlotById);

// Update plot information
router.put('/:id', plotController.updatePlot);

// Delete a plot
router.delete('/:id', plotController.deletePlot);

export default router;

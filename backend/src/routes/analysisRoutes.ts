import express from 'express';
import { AnalysisController } from '../controllers/analysisController';

const router = express.Router();
const analysisController = new AnalysisController();

// Analyze plot for crop health
router.get('/plot/:id', analysisController.analyzePlot);

// Get NDVI time series data
router.get('/plot/:id/ndvi', analysisController.getNDVITimeSeries);

// Get weather data for plot location
router.get('/plot/:id/weather', analysisController.getWeatherData);

// Get satellite imagery URL
router.get('/plot/:id/imagery', analysisController.getSatelliteImagery);

export default router;

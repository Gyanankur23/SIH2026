import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysisService';

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  analyzePlot = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const analysis = await this.analysisService.analyzePlot(idStr);
      
      if (!analysis) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.json(analysis);
    } catch (error: any) {
      console.error('Error analyzing plot:', error);
      res.status(500).json({
        error: { message: 'Failed to analyze plot', status: 500 }
      });
    }
  };

  getNDVITimeSeries = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { startDate, endDate } = req.query;
      
      const ndviData = await this.analysisService.getNDVITimeSeries(idStr, {
        startDate: startDate as string,
        endDate: endDate as string
      });
      
      res.json(ndviData);
    } catch (error: any) {
      console.error('Error fetching NDVI time series:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch NDVI data', status: 500 }
      });
    }
  };

  getWeatherData = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const weatherData = await this.analysisService.getWeatherData(idStr);
      
      if (!weatherData) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.json(weatherData);
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch weather data', status: 500 }
      });
    }
  };

  getSatelliteImagery = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { date, provider } = req.query;
      
      const imagery = await this.analysisService.getSatelliteImagery(idStr, {
        date: date as string,
        provider: provider as string
      });
      
      res.json(imagery);
    } catch (error: any) {
      console.error('Error fetching satellite imagery:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch satellite imagery', status: 500 }
      });
    }
  };
}

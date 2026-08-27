import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { SatelliteService } from './satelliteService';
import { WeatherService } from './weatherService';
import { NDVICalculator } from '../utils/ndviCalculator';

interface TimeSeriesOptions {
  startDate?: string;
  endDate?: string;
}

interface ImageryOptions {
  date?: string;
  provider?: string;
}

export class AnalysisService {
  private satelliteService: SatelliteService;
  private weatherService: WeatherService;
  private ndviCalculator: NDVICalculator;

  constructor() {
    this.satelliteService = new SatelliteService();
    this.weatherService = new WeatherService();
    this.ndviCalculator = new NDVICalculator();
  }

  async analyzePlot(plotId: string) {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
      include: {
        historicalData: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });

    if (!plot) {
      return null;
    }

    // Get latest NDVI data
    const latestData = plot.historicalData[0];
    const currentNDVI = latestData?.ndvi || 0;

    // Calculate NDVI trend
    const ndviTrend = this.calculateNDVITrend(plot.historicalData);

    // Detect anomalies
    const anomalies = NDVICalculator.detectAnomalies(plot.historicalData);

    // Get current weather
    const weatherData = await this.weatherService.getCurrentWeather(plot.location);

    // Get latest satellite imagery
    const satelliteImagery = await this.satelliteService.getLatestImagery(
      plot.coordinates,
      plot.location
    );

    // Calculate health score
    const healthScore = this.calculateHealthScore(currentNDVI, anomalies, weatherData);

    return {
      plot: {
        id: plot.id,
        name: plot.name,
        location: plot.location,
        cropType: plot.cropType,
        area: plot.area
      },
      currentNDVI,
      ndviTrend,
      healthScore,
      anomalies,
      weatherData,
      satelliteImagery,
      lastUpdated: latestData?.date || null
    };
  }

  async getNDVITimeSeries(plotId: string, options: TimeSeriesOptions = {}) {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId }
    });

    if (!plot) {
      return null;
    }

    const where: any = { plotId };
    
    if (options.startDate) {
      where.date = { ...where.date, gte: new Date(options.startDate) };
    }
    
    if (options.endDate) {
      where.date = { ...where.date, lte: new Date(options.endDate) };
    }

    const historicalData = await prisma.historicalData.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    return historicalData.map((data: any) => ({
      date: data.date.toISOString().split('T')[0],
      ndvi: data.ndvi,
      rainfall: data.rainfall,
      temperature: data.temperature,
      humidity: data.humidity
    }));
  }

  async getWeatherData(plotId: string) {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId }
    });

    if (!plot) {
      return null;
    }

    const currentWeather = await this.weatherService.getCurrentWeather(plot.location);
    const forecast = await this.weatherService.getForecast(plot.location);

    return {
      current: currentWeather,
      forecast,
      location: plot.location
    };
  }

  async getSatelliteImagery(plotId: string, options: ImageryOptions = {}) {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId }
    });

    if (!plot) {
      return null;
    }

    if (options.date) {
      return await this.satelliteService.getHistoricalImagery(
        plot.coordinates,
        new Date(options.date),
        options.provider
      );
    }

    return await this.satelliteService.getLatestImagery(
      plot.coordinates,
      plot.location,
      options.provider
    );
  }

  private calculateNDVITrend(historicalData: any[]): string {
    if (historicalData.length < 2) return 'insufficient_data';

    const recent = historicalData.slice(0, 7);
    const avgRecent = recent.reduce((sum, d) => sum + d.ndvi, 0) / recent.length;
    
    const older = historicalData.slice(7, 14);
    if (older.length === 0) return 'insufficient_data';
    
    const avgOlder = older.reduce((sum, d) => sum + d.ndvi, 0) / older.length;
    
    const change = ((avgRecent - avgOlder) / avgOlder) * 100;

    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  private calculateHealthScore(ndvi: number, anomalies: any[], weather: any): number {
    let score = 100;

    // NDVI impact (0-30 points)
    if (ndvi < 0.3) score -= 30;
    else if (ndvi < 0.5) score -= 20;
    else if (ndvi < 0.7) score -= 10;

    // Anomaly impact (0-40 points)
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
    const highAnomalies = anomalies.filter(a => a.severity === 'high').length;
    
    score -= (criticalAnomalies * 15) + (highAnomalies * 10);

    // Weather impact (0-30 points)
    if (weather?.extremeWeather) score -= 20;
    if (weather?.droughtRisk) score -= 15;
    if (weather?.floodRisk) score -= 15;

    return Math.max(0, Math.min(100, score));
  }
}

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AlertService } from '../services/alertService';

const prisma = new PrismaClient();

export class AlertController {
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  getPlotAlerts = async (req: Request, res: Response) => {
    try {
      const { plotId } = req.params;
      const plotIdStr = Array.isArray(plotId) ? plotId[0] : plotId;
      const { severity, resolved } = req.query;
      
      const alerts = await this.alertService.getPlotAlerts(plotIdStr, {
        severity: severity as string,
        resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined
      });
      
      res.json(alerts);
    } catch (error: any) {
      console.error('Error fetching plot alerts:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch alerts', status: 500 }
      });
    }
  };

  getFarmerAlerts = async (req: Request, res: Response) => {
    try {
      const { farmerId } = req.params;
      const farmerIdStr = Array.isArray(farmerId) ? farmerId[0] : farmerId;
      const { severity, resolved, limit } = req.query;
      
      const alerts = await this.alertService.getFarmerAlerts(farmerIdStr, {
        severity: severity as string,
        resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      
      res.json(alerts);
    } catch (error: any) {
      console.error('Error fetching farmer alerts:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch alerts', status: 500 }
      });
    }
  };

  getAllAlerts = async (req: Request, res: Response) => {
    try {
      const { severity, resolved, limit, region } = req.query;
      
      const alerts = await this.alertService.getAllAlerts({
        severity: severity as string,
        resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        region: region as string
      });
      
      res.json(alerts);
    } catch (error: any) {
      console.error('Error fetching all alerts:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch alerts', status: 500 }
      });
    }
  };

  resolveAlert = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const alert = await this.alertService.resolveAlert(idStr);
      
      if (!alert) {
        return res.status(404).json({
          error: { message: 'Alert not found', status: 404 }
        });
      }

      res.json(alert);
    } catch (error: any) {
      console.error('Error resolving alert:', error);
      res.status(500).json({
        error: { message: 'Failed to resolve alert', status: 500 }
      });
    }
  };

  createAlert = async (req: Request, res: Response) => {
    try {
      const { plotId, type, severity, message, recommendation, ndvi } = req.body;

      // Validate required fields
      if (!plotId || !type || !severity || !message) {
        return res.status(400).json({
          error: { message: 'Missing required fields', status: 400 }
        });
      }

      // Validate plot exists
      const plot = await prisma.plot.findUnique({
        where: { id: plotId }
      });

      if (!plot) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      const alert = await this.alertService.createAlert({
        plotId,
        type,
        severity,
        message,
        recommendation,
        ndvi
      });

      res.status(201).json(alert);
    } catch (error: any) {
      console.error('Error creating alert:', error);
      res.status(500).json({
        error: { message: 'Failed to create alert', status: 500 }
      });
    }
  };
}

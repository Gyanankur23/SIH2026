import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PlotService } from '../services/plotService';

const prisma = new PrismaClient();

export class PlotController {
  private plotService: PlotService;

  constructor() {
    this.plotService = new PlotService();
  }

  registerPlot = async (req: Request, res: Response) => {
    try {
      const { name, farmerId, location, coordinates, cropType, area, soilType } = req.body;

      // Validate required fields
      if (!name || !farmerId || !location || !coordinates || !cropType || !area) {
        return res.status(400).json({
          error: { message: 'Missing required fields', status: 400 }
        });
      }

      // Validate farmer exists
      const farmer = await prisma.farmer.findUnique({
        where: { id: farmerId }
      });

      if (!farmer) {
        return res.status(404).json({
          error: { message: 'Farmer not found', status: 404 }
        });
      }

      const plot = await this.plotService.registerPlot({
        name,
        farmerId,
        location,
        coordinates,
        cropType,
        area,
        soilType
      });

      res.status(201).json(plot);
    } catch (error: any) {
      console.error('Error registering plot:', error);
      res.status(500).json({
        error: { message: 'Failed to register plot', status: 500 }
      });
    }
  };

  getFarmerPlots = async (req: Request, res: Response) => {
    try {
      const { farmerId } = req.params;
      const farmerIdStr = Array.isArray(farmerId) ? farmerId[0] : farmerId;
      const plots = await this.plotService.getFarmerPlots(farmerIdStr);
      res.json(plots);
    } catch (error: any) {
      console.error('Error fetching farmer plots:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch plots', status: 500 }
      });
    }
  };

  getPlotById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const plot = await this.plotService.getPlotById(idStr);
      
      if (!plot) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.json(plot);
    } catch (error: any) {
      console.error('Error fetching plot:', error);
      res.status(500).json({
        error: { message: 'Failed to fetch plot', status: 500 }
      });
    }
  };

  updatePlot = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const updates = req.body;
      
      const plot = await this.plotService.updatePlot(idStr, updates);
      
      if (!plot) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.json(plot);
    } catch (error: any) {
      console.error('Error updating plot:', error);
      res.status(500).json({
        error: { message: 'Failed to update plot', status: 500 }
      });
    }
  };

  deletePlot = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      await this.plotService.deletePlot(idStr);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting plot:', error);
      res.status(500).json({
        error: { message: 'Failed to delete plot', status: 500 }
      });
    }
  };
}

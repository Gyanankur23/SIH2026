import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RegisterPlotData {
  name: string;
  farmerId: string;
  location: string;
  coordinates: any;
  cropType: string;
  area: number;
  soilType?: string;
}

export class PlotService {
  async registerPlot(data: RegisterPlotData) {
    return await prisma.plot.create({
      data: {
        name: data.name,
        farmerId: data.farmerId,
        location: data.location,
        coordinates: data.coordinates,
        cropType: data.cropType.toUpperCase(),
        area: data.area,
        soilType: data.soilType
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true
          }
        }
      }
    });
  }

  async getFarmerPlots(farmerId: string) {
    return await prisma.plot.findMany({
      where: { farmerId },
      include: {
        _count: {
          select: { alerts: true }
        },
        alerts: {
          where: { resolved: false },
          orderBy: { timestamp: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPlotById(id: string) {
    return await prisma.plot.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true
          }
        },
        alerts: {
          where: { resolved: false },
          orderBy: { timestamp: 'desc' }
        },
        historicalData: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });
  }

  async updatePlot(id: string, updates: any) {
    return await prisma.plot.update({
      where: { id },
      data: updates,
      include: {
        farmer: true
      }
    });
  }

  async deletePlot(id: string) {
    await prisma.plot.delete({
      where: { id }
    });
  }
}

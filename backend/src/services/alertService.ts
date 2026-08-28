import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AlertFilters {
  severity?: string;
  resolved?: boolean;
  limit?: number;
  region?: string;
}

interface CreateAlertData {
  plotId: string;
  type: string;
  severity: string;
  message: string;
  recommendation?: string;
  ndvi?: number;
}

export class AlertService {
  async getPlotAlerts(plotId: string, filters: AlertFilters = {}) {
    const where: any = { plotId };
    
    if (filters.severity) {
      where.severity = filters.severity.toUpperCase();
    }
    
    if (filters.resolved !== undefined) {
      where.resolved = filters.resolved;
    }

    return await prisma.alert.findMany({
      where,
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            location: true,
            farmerId: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: filters.limit
    });
  }

  async getFarmerAlerts(farmerId: string, filters: AlertFilters = {}) {
    const where: any = {};
    
    if (filters.severity) {
      where.severity = filters.severity.toUpperCase();
    }
    
    if (filters.resolved !== undefined) {
      where.resolved = filters.resolved;
    }

    // First get the farmer's plots
    const farmerPlots = await prisma.plot.findMany({
      where: { farmerId },
      select: { id: true }
    });

    const plotIds = farmerPlots.map(p => p.id);
    where.plotId = { in: plotIds };

    return await prisma.alert.findMany({
      where,
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            location: true,
            cropType: true,
            farmerId: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100
    });
  }

  async getAllAlerts(filters: AlertFilters = {}) {
    const where: any = {};
    
    if (filters.severity) {
      where.severity = filters.severity.toUpperCase();
    }
    
    if (filters.resolved !== undefined) {
      where.resolved = filters.resolved;
    }

    // If region filter is provided, filter by plot location
    if (filters.region && filters.region !== 'All Maharashtra') {
      const plotsInRegion = await prisma.plot.findMany({
        where: {
          location: {
            contains: filters.region
          }
        },
        select: { id: true }
      });
      
      const plotIds = plotsInRegion.map(p => p.id);
      where.plotId = { in: plotIds };
    }

    return await prisma.alert.findMany({
      where,
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            location: true,
            cropType: true,
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100
    });
  }

  async resolveAlert(id: string) {
    return await prisma.alert.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date()
      }
    });
  }

  async createAlert(data: CreateAlertData) {
    return await prisma.alert.create({
      data: {
        plotId: data.plotId,
        type: data.type.toUpperCase(),
        severity: data.severity.toUpperCase(),
        message: data.message,
        recommendation: data.recommendation || '',
        ndvi: data.ndvi
      },
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            location: true,
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });
  }
}

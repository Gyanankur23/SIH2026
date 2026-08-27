import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  async generatePDFReport(plotId: string) {
    try {
      const plot = await prisma.plot.findUnique({
        where: { id: plotId },
        include: {
          farmer: true,
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

      if (!plot) {
        return null;
      }

      // In production, use a PDF library like pdfkit or puppeteer
      // For demo, return a simple text-based report
      const reportContent = this.generateReportContent(plot);
      
      // Convert to Buffer (in production, this would be actual PDF)
      return Buffer.from(reportContent, 'utf-8');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    }
  }

  async generateCSVReport(plotId: string) {
    try {
      const plot = await prisma.plot.findUnique({
        where: { id: plotId },
        include: {
          historicalData: {
            orderBy: { date: 'asc' }
          }
        }
      });

      if (!plot) {
        return null;
      }

      // Generate CSV content
      const headers = ['Date', 'NDVI', 'Rainfall (mm)', 'Temperature (°C)', 'Humidity (%)', 'Satellite Provider'];
      const rows = plot.historicalData.map((data: any) => [
        data.date.toISOString().split('T')[0],
        data.ndvi.toFixed(3),
        data.rainfall?.toFixed(1) || 'N/A',
        data.temperature?.toFixed(1) || 'N/A',
        data.humidity?.toFixed(1) || 'N/A',
        data.satelliteProvider || 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error generating CSV report:', error);
      throw error;
    }
  }

  async generateRegionalReport(region?: string) {
    try {
      const where: any = {};
      if (region) {
        where.location = {
          contains: region,
          mode: 'insensitive'
        };
      }

      const plots = await prisma.plot.findMany({
        where,
        include: {
          farmer: true,
          alerts: {
            where: { resolved: false }
          },
          historicalData: {
            orderBy: { date: 'desc' },
            take: 1
          }
        }
      });

      // Generate regional summary
      const summary = {
        region: region || 'All Regions',
        totalPlots: plots.length,
        totalFarmers: new Set(plots.map(p => p.farmerId)).size,
        totalArea: plots.reduce((sum: number, p: any) => sum + p.area, 0),
        activeAlerts: plots.reduce((sum: number, p: any) => sum + p.alerts.length, 0),
        averageNDVI: plots.reduce((sum: number, p: any) => {
          const latestNDVI = p.historicalData[0]?.ndvi || 0;
          return sum + latestNDVI;
        }, 0) / plots.length,
        cropDistribution: this.getCropDistribution(plots),
        riskDistribution: this.getRiskDistribution(plots)
      };

      const reportContent = this.generateRegionalReportContent(summary);
      
      // Convert to Buffer (in production, this would be actual PDF)
      return Buffer.from(reportContent, 'utf-8');
    } catch (error) {
      console.error('Error generating regional report:', error);
      throw error;
    }
  }

  private generateReportContent(plot: any): string {
    const latestData = plot.historicalData[0];
    
    return `
CROP HEALTH MONITORING REPORT
=============================
Generated: ${new Date().toISOString()}

PLOT INFORMATION
----------------
Plot ID: ${plot.id}
Plot Name: ${plot.name}
Location: ${plot.location}
Crop Type: ${plot.cropType}
Area: ${plot.area} hectares
Soil Type: ${plot.soilType || 'Not specified'}

FARMER INFORMATION
-------------------
Name: ${plot.farmer.name}
Email: ${plot.farmer.email}
Phone: ${plot.farmer.phone || 'Not provided'}
Location: ${plot.farmer.location}

CURRENT STATUS
--------------
Current NDVI: ${latestData?.ndvi?.toFixed(3) || 'N/A'}
Last Updated: ${latestData?.date?.toISOString().split('T')[0] || 'N/A'}
Satellite Provider: ${latestData?.satelliteProvider || 'N/A'}

Recent Weather:
- Temperature: ${latestData?.temperature?.toFixed(1) || 'N/A'}°C
- Humidity: ${latestData?.humidity?.toFixed(1) || 'N/A'}%
- Rainfall: ${latestData?.rainfall?.toFixed(1) || 'N/A'}mm

ACTIVE ALERTS (${plot.alerts.length})
------------------
${plot.alerts.map((alert: any, index: number) => `
${index + 1}. ${alert.type}
   Severity: ${alert.severity}
   Message: ${alert.message}
   Recommendation: ${alert.recommendation || 'None provided'}
   Timestamp: ${alert.timestamp.toISOString()}
`).join('\n')}

HISTORICAL DATA (Last 30 records)
----------------------------------
${plot.historicalData.slice(0, 30).map((data: any) => `
${data.date.toISOString().split('T')[0]} | NDVI: ${data.ndvi.toFixed(3)} | Rain: ${data.rainfall?.toFixed(1) || 'N/A'}mm | Temp: ${data.temperature?.toFixed(1) || 'N/A'}°C | Hum: ${data.humidity?.toFixed(1) || 'N/A'}%
`).join('\n')}

---
End of Report
Note: This is a text-based report. Configure PDF generation library for formatted PDFs.
`;
  }

  private generateRegionalReportContent(summary: any): string {
    return `
REGIONAL AGRICULTURAL SUMMARY REPORT
====================================
Generated: ${new Date().toISOString()}

REGION OVERVIEW
---------------
Region: ${summary.region}
Total Plots: ${summary.totalPlots}
Total Farmers: ${summary.totalFarmers}
Total Area: ${summary.totalArea.toFixed(2)} hectares
Active Alerts: ${summary.activeAlerts}
Average NDVI: ${summary.averageNDVI.toFixed(3)}

CROP DISTRIBUTION
-----------------
${Object.entries(summary.cropDistribution).map(([crop, count]) => 
  `${crop}: ${count} plots (${((count as number / summary.totalPlots) * 100).toFixed(1)}%)`
).join('\n')}

RISK DISTRIBUTION
------------------
Critical: ${summary.riskDistribution.critical} plots
High: ${summary.riskDistribution.high} plots
Medium: ${summary.riskDistribution.medium} plots
Low: ${summary.riskDistribution.low} plots

---
End of Regional Report
Note: This is a text-based report. Configure PDF generation library for formatted PDFs.
`;
  }

  private getCropDistribution(plots: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    plots.forEach(plot => {
      const crop = plot.cropType;
      distribution[crop] = (distribution[crop] || 0) + 1;
    });
    return distribution;
  }

  private getRiskDistribution(plots: any[]): Record<string, number> {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    
    plots.forEach(plot => {
      const latestNDVI = plot.historicalData[0]?.ndvi || 0.7;
      
      if (latestNDVI < 0.3) distribution.critical++;
      else if (latestNDVI < 0.5) distribution.high++;
      else if (latestNDVI < 0.7) distribution.medium++;
      else distribution.low++;
    });
    
    return distribution;
  }
}

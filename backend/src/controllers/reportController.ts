import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  generatePDFReport = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const pdfBuffer = await this.reportService.generatePDFReport(idStr);
      
      if (!pdfBuffer) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=plot-${id}-report.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error generating PDF report:', error);
      res.status(500).json({
        error: { message: 'Failed to generate PDF report', status: 500 }
      });
    }
  };

  generateCSVReport = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const csvData = await this.reportService.generateCSVReport(idStr);
      
      if (!csvData) {
        return res.status(404).json({
          error: { message: 'Plot not found', status: 404 }
        });
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=plot-${id}-report.csv`);
      res.send(csvData);
    } catch (error: any) {
      console.error('Error generating CSV report:', error);
      res.status(500).json({
        error: { message: 'Failed to generate CSV report', status: 500 }
      });
    }
  };

  generateRegionalReport = async (req: Request, res: Response) => {
    try {
      const { region } = req.query;
      const pdfBuffer = await this.reportService.generateRegionalReport(region as string);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=regional-${region || 'all'}-report.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Error generating regional report:', error);
      res.status(500).json({
        error: { message: 'Failed to generate regional report', status: 500 }
      });
    }
  };
}

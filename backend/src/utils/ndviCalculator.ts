export class NDVICalculator {
  /**
   * Calculate NDVI from NIR and Red band values
   * NDVI = (NIR - Red) / (NIR + Red)
   */
  static calculateNDVI(nir: number, red: number): number {
    if (nir + red === 0) return 0;
    return (nir - red) / (nir + red);
  }

  /**
   * Calculate vegetation health from NDVI value
   */
  static getHealthStatus(ndvi: number): string {
    if (ndvi < 0.1) return 'Barren';
    if (ndvi < 0.3) return 'Unhealthy';
    if (ndvi < 0.5) return 'Moderate';
    if (ndvi < 0.7) return 'Healthy';
    return 'Very Healthy';
  }

  /**
   * Detect anomalies in NDVI time series data
   */
  static detectAnomalies(historicalData: any[]): any[] {
    const anomalies: any[] = [];
    
    if (historicalData.length < 3) {
      return anomalies;
    }

    // Calculate moving average
    const windowSize = 5;
    for (let i = windowSize; i < historicalData.length; i++) {
      const window = historicalData.slice(i - windowSize, i);
      const avgNDVI = window.reduce((sum, d) => sum + d.ndvi, 0) / windowSize;
      const currentNDVI = historicalData[i].ndvi;
      
      // Calculate percent change
      const percentChange = ((currentNDVI - avgNDVI) / avgNDVI) * 100;
      
      // Detect significant drops (potential stress)
      if (percentChange < -15) {
        anomalies.push({
          date: historicalData[i].date,
          ndvi: currentNDVI,
          expectedNDVI: avgNDVI,
          percentChange: percentChange.toFixed(2),
          severity: percentChange < -30 ? 'critical' : percentChange < -25 ? 'high' : 'medium',
          type: 'NDVI Decline',
          message: `Significant NDVI drop detected: ${percentChange.toFixed(1)}% below moving average`
        });
      }
      
      // Detect unusually high values (potential data errors or exceptional growth)
      if (percentChange > 20) {
        anomalies.push({
          date: historicalData[i].date,
          ndvi: currentNDVI,
          expectedNDVI: avgNDVI,
          percentChange: percentChange.toFixed(2),
          severity: 'low',
          type: 'Unusual Growth',
          message: `Unusually high NDVI: ${percentChange.toFixed(1)}% above moving average`
        });
      }
    }

    // Detect stagnation (no growth over extended period)
    if (historicalData.length >= 10) {
      const recent = historicalData.slice(0, 10);
      const firstHalf = recent.slice(0, 5);
      const secondHalf = recent.slice(5);
      
      const avgFirst = firstHalf.reduce((sum, d) => sum + d.ndvi, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum, d) => sum + d.ndvi, 0) / secondHalf.length;
      
      const change = Math.abs(avgSecond - avgFirst);
      
      if (change < 0.05) {
        anomalies.push({
          date: historicalData[0].date,
          ndvi: avgSecond,
          expectedNDVI: avgFirst + 0.1, // Expected growth
          percentChange: ((avgSecond - avgFirst) / avgFirst * 100).toFixed(2),
          severity: 'medium',
          type: 'Growth Stagnation',
          message: 'NDVI has remained stable over 10 days - possible growth stagnation'
        });
      }
    }

    return anomalies;
  }

  /**
   * Calculate trend direction from time series
   */
  static calculateTrend(historicalData: any[]): string {
    if (historicalData.length < 2) return 'insufficient_data';

    // Simple linear regression
    const n = historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    historicalData.forEach((data, index) => {
      const x = index;
      const y = data.ndvi;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    if (slope > 0.01) return 'improving';
    if (slope < -0.01) return 'declining';
    return 'stable';
  }

  /**
   * Generate synthetic NDVI data for demo purposes
   */
  static generateSyntheticNDVI(days: number, baseNDVI: number = 0.6): number[] {
    const data: number[] = [];
    let currentNDVI = baseNDVI;
    
    for (let i = 0; i < days; i++) {
      // Add random variation
      const variation = (Math.random() - 0.5) * 0.1;
      // Add seasonal trend
      const seasonal = Math.sin(i / 30 * Math.PI) * 0.05;
      
      currentNDVI = Math.max(0.1, Math.min(0.9, currentNDVI + variation + seasonal));
      data.push(parseFloat(currentNDVI.toFixed(3)));
    }
    
    return data;
  }

  /**
   * Compare NDVI with regional average
   */
  static compareWithRegional(currentNDVI: number, regionalAverage: number): {
    difference: number;
    status: string;
    message: string;
  } {
    const difference = ((currentNDVI - regionalAverage) / regionalAverage) * 100;
    
    let status, message;
    if (difference > 10) {
      status = 'above_average';
      message = `NDVI is ${difference.toFixed(1)}% above regional average - excellent condition`;
    } else if (difference > -10) {
      status = 'normal';
      message = `NDVI is within normal range for the region`;
    } else if (difference > -20) {
      status = 'below_average';
      message = `NDVI is ${Math.abs(difference).toFixed(1)}% below regional average - monitor closely`;
    } else {
      status = 'concerning';
      message = `NDVI is ${Math.abs(difference).toFixed(1)}% below regional average - requires attention`;
    }
    
    return { difference, status, message };
  }
}

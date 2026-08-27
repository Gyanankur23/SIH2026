import { PrismaClient } from '@prisma/client';
import { NDVICalculator } from '../src/utils/ndviCalculator';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.alert.deleteMany();
  await prisma.historicalData.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.farmer.deleteMany();

  console.log('Cleared existing data');

  // Create sample farmers from Maharashtra
  const farmers = await Promise.all([
    prisma.farmer.create({
      data: {
        name: 'Ramesh Patil',
        email: 'ramesh.patil@example.com',
        phone: '+91 98765 43210',
        location: 'Nashik, Maharashtra'
      }
    }),
    prisma.farmer.create({
      data: {
        name: 'Sunita Sharma',
        email: 'sunita.sharma@example.com',
        phone: '+91 98765 43211',
        location: 'Nashik, Maharashtra'
      }
    }),
    prisma.farmer.create({
      data: {
        name: 'Vijay Kumar',
        email: 'vijay.kumar@example.com',
        phone: '+91 98765 43212',
        location: 'Pune, Maharashtra'
      }
    }),
    prisma.farmer.create({
      data: {
        name: 'Anjali Deshmukh',
        email: 'anjali.deshmukh@example.com',
        phone: '+91 98765 43213',
        location: 'Ahmednagar, Maharashtra'
      }
    }),
    prisma.farmer.create({
      data: {
        name: 'Dilip Singh',
        email: 'dilip.singh@example.com',
        phone: '+91 98765 43214',
        location: 'Aurangabad, Maharashtra'
      }
    })
  ]);

  console.log(`Created ${farmers.length} farmers`);

  // Create sample plots
  const plots = await Promise.all([
    // Ramesh Patil's plots
    prisma.plot.create({
      data: {
        name: 'North Field - Wheat',
        farmerId: farmers[0].id,
        location: 'Nashik, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [73.7897, 19.9975],
            [73.7997, 19.9975],
            [73.7997, 20.0075],
            [73.7897, 20.0075],
            [73.7897, 19.9975]
          ]]
        },
        cropType: 'WHEAT',
        area: 2.5,
        soilType: 'Black Cotton Soil'
      }
    }),
    prisma.plot.create({
      data: {
        name: 'South Field - Cotton',
        farmerId: farmers[0].id,
        location: 'Nashik, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [73.7797, 19.9875],
            [73.7897, 19.9875],
            [73.7897, 19.9975],
            [73.7797, 19.9975],
            [73.7797, 19.9875]
          ]]
        },
        cropType: 'COTTON',
        area: 1.8,
        soilType: 'Red Soil'
      }
    }),

    // Sunita Sharma's plots
    prisma.plot.create({
      data: {
        name: 'East Field - Soybean',
        farmerId: farmers[1].id,
        location: 'Nashik, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [73.7997, 19.9775],
            [73.8097, 19.9775],
            [73.8097, 19.9875],
            [73.7997, 19.9875],
            [73.7997, 19.9775]
          ]]
        },
        cropType: 'SOYBEAN',
        area: 2.0,
        soilType: 'Laterite Soil'
      }
    }),

    // Vijay Kumar's plots
    prisma.plot.create({
      data: {
        name: 'Main Field - Rice',
        farmerId: farmers[2].id,
        location: 'Pune, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [73.8567, 18.5204],
            [73.8667, 18.5204],
            [73.8667, 18.5304],
            [73.8567, 18.5304],
            [73.8567, 18.5204]
          ]]
        },
        cropType: 'RICE',
        area: 3.2,
        soilType: 'Alluvial Soil'
      }
    }),

    // Anjali Deshmukh's plots
    prisma.plot.create({
      data: {
        name: 'West Field - Sugarcane',
        farmerId: farmers[3].id,
        location: 'Ahmednagar, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [74.7396, 19.0948],
            [74.7496, 19.0948],
            [74.7496, 19.1048],
            [74.7396, 19.1048],
            [74.7396, 19.0948]
          ]]
        },
        cropType: 'SUGARCANE',
        area: 2.8,
        soilType: 'Black Soil'
      }
    }),

    // Dilip Singh's plots
    prisma.plot.create({
      data: {
        name: 'Central Field - Tomato',
        farmerId: farmers[4].id,
        location: 'Aurangabad, Maharashtra',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [75.3433, 19.8762],
            [75.3533, 19.8762],
            [75.3533, 19.8862],
            [75.3433, 19.8862],
            [75.3433, 19.8762]
          ]]
        },
        cropType: 'TOMATO',
        area: 1.5,
        soilType: 'Red Loamy Soil'
      }
    })
  ]);

  console.log(`Created ${plots.length} plots`);

  // Generate historical NDVI data for each plot
  for (const plot of plots) {
    const ndviBase = 0.5 + Math.random() * 0.3; // Random base NDVI between 0.5 and 0.8
    const ndviData = NDVICalculator.generateSyntheticNDVI(30, ndviBase);
    
    const historicalData = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      
      historicalData.push({
        plotId: plot.id,
        date: date,
        ndvi: ndviData[i],
        rainfall: Math.random() * 50, // 0-50mm rainfall
        temperature: 20 + Math.random() * 15, // 20-35°C temperature
        humidity: 40 + Math.random() * 40, // 40-80% humidity
        satelliteProvider: i % 5 === 0 ? 'landsat' : 'sentinel-2',
        imageUrl: `https://api.satellite.mock/v1/image?plot=${plot.id}&date=${date.toISOString().split('T')[0]}`
      });
    }

    await prisma.historicalData.createMany({
      data: historicalData
    });
  }

  console.log('Generated historical NDVI data for all plots');

  // Create sample alerts
  const alerts = await Promise.all([
    prisma.alert.create({
      data: {
        plotId: plots[1].id, // South Field - Cotton
        type: 'MOISTURE_STRESS',
        severity: 'MEDIUM',
        message: 'Moisture stress detected in northwest corner of plot. Current soil moisture levels are 15% below optimal for this growth stage.',
        recommendation: 'Consider irrigation within 24-48 hours. Monitor soil moisture sensors daily.',
        ndvi: 0.58
      }
    }),
    prisma.alert.create({
      data: {
        plotId: plots[0].id, // North Field - Wheat
        type: 'WEATHER_ALERT',
        severity: 'HIGH',
        message: 'Heavy rainfall expected in 3 days; risk of waterlogging. Weather forecast predicts 80mm precipitation over 48 hours.',
        recommendation: 'Ensure proper drainage systems. Consider harvest if crops are mature. Prepare flood mitigation measures.',
        ndvi: 0.72
      }
    }),
    prisma.alert.create({
      data: {
        plotId: plots[2].id, // East Field - Soybean
        type: 'NUTRIENT_DEFICIENCY',
        severity: 'HIGH',
        message: 'Nitrogen deficiency detected through spectral analysis. Leaf yellowing patterns indicate insufficient nitrogen levels.',
        recommendation: 'Apply nitrogen fertilizer at recommended rate. Consider foliar application for quick absorption. Retest in 7 days.',
        ndvi: 0.51
      }
    }),
    prisma.alert.create({
      data: {
        plotId: plots[4].id, // West Field - Sugarcane
        type: 'PEST_INFESTATION',
        severity: 'MEDIUM',
        message: 'Conditions favorable for armyworm infestation. Current temperature and humidity patterns match historical outbreak conditions.',
        recommendation: 'Implement preventive pest control measures. Increase monitoring frequency. Prepare biological control agents.',
        ndvi: 0.62
      }
    }),
    prisma.alert.create({
      data: {
        plotId: plots[5].id, // Central Field - Tomato
        type: 'DISEASE_RISK',
        severity: 'CRITICAL',
        message: 'Early blight risk identified. Weather conditions (high humidity, moderate temperatures) are conducive to disease development.',
        recommendation: 'URGENT: Apply fungicide treatment immediately. Remove affected plant material. Improve air circulation through spacing.',
        ndvi: 0.45
      }
    }),
    prisma.alert.create({
      data: {
        plotId: plots[3].id, // Main Field - Rice
        type: 'GROWTH_ANOMALY',
        severity: 'LOW',
        message: 'Growth rate 5% below regional average for this time of year. No immediate cause for concern but worth monitoring.',
        recommendation: 'Continue normal cultivation practices. Compare with neighboring fields. Investigate if deviation persists beyond 14 days.',
        ndvi: 0.68
      }
    })
  ]);

  console.log(`Created ${alerts.length} alerts`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# 🌱 CropGuard - Satellite-Based Crop Health Monitoring System

**Smart India Hackathon 2026 Project**

A production-ready full-stack application that empowers farmers with real-time satellite imagery, AI-powered crop health analysis, and early warning alerts for proactive agricultural decision-making.

## 🌟 Features

### For Farmers
- **Plot Registration**: Register farm plots with geographic boundaries
- **Satellite Imagery**: Real-time monitoring using Sentinel-2 and Landsat data
- **NDVI Analysis**: Advanced vegetation index calculations for crop health assessment
- **Weather Integration**: Current conditions and 5-day forecasts
- **Alert System**: Plain-language warnings for moisture stress, disease risk, and adverse weather
- **Historical Trends**: Track crop health over time with interactive charts

### For Agricultural Officers
- **Regional Dashboard**: Monitor multiple farms across districts
- **Risk Prioritization**: AI-powered ranking of plots by risk level
- **Geographic Visualization**: Interactive map showing risk distribution
- **Report Generation**: Export PDF/CSV reports for individual plots or regions
- **Alert Management**: View and manage alerts across all monitored plots

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom agricultural theme
- **React Router** for navigation
- **Leaflet** for interactive maps
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** for data persistence
- **RESTful API** architecture

### External APIs
- **Sentinel-2/Landsat** for satellite imagery
- **OpenWeather** for weather data
- **OpenStreetMap** for map tiles

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase/Railway for cloud database)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Gyanankur23/SIH2026.git
cd SIH2026
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb sih2026

# Or using psql
psql -c "CREATE DATABASE sih2026;"
```

#### Option B: Supabase (Recommended for Production)
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database connection string from Settings > Database

#### Option C: Railway
1. Create a PostgreSQL database on Railway
2. Copy the connection string

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL and API keys
# DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
# OPENWEATHER_API_KEY="your_api_key"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env if needed (defaults should work for local development)
# VITE_API_URL="http://localhost:3001/api"

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 API Keys Configuration

### OpenWeather API (Free)
1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Create a free account
3. Get your API key from API keys section
4. Add to backend `.env`: `OPENWEATHER_API_KEY="your_key"`

### Sentinel Hub (Optional)
For production satellite imagery, configure Sentinel Hub credentials:
- Get API key from [sentinel-hub.com](https://www.sentinel-hub.com/)
- Add to backend `.env`:
  ```
  SENTINEL_HUB_API_KEY="your_key"
  SENTINEL_HUB_CLIENT_ID="your_client_id"
  SENTINEL_HUB_CLIENT_SECRET="your_client_secret"
  ```

**Note**: The application works with mock data if API keys are not configured.

## 📊 Database Schema

### Farmers
- Personal information and contact details
- Location for regional grouping

### Plots
- Geographic boundaries (GeoJSON)
- Crop type and area
- Soil type information
- Relationship to farmers and historical data

### Alerts
- Type and severity classification
- Plain-language messages and recommendations
- NDVI values at alert time
- Resolution tracking

### Historical Data
- Daily NDVI measurements
- Weather data (rainfall, temperature, humidity)
- Satellite imagery references
- Time-series analysis support

## 🛠️ Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed database with demo data
npm run prisma:studio      # Open Prisma Studio (database GUI)
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Backend (Vercel/Railway)

#### Vercel Serverless Functions
```bash
cd backend
npm install -g vercel
vercel
```

#### Railway (Alternative)
1. Create a new project on Railway
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy automatically

### Environment Variables for Production

Set these in your deployment platform:

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `OPENWEATHER_API_KEY` - Weather API key
- `SENTINEL_HUB_API_KEY` - Satellite imagery API key (optional)
- `NODE_ENV=production`

**Frontend:**
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.vercel.app/api`)

## 📱 Demo Data

The seed script creates realistic demo data for Maharashtra region:
- 5 farmers with contact information
- 6 plots with different crop types (wheat, cotton, soybean, rice, sugarcane, tomato)
- 30 days of historical NDVI and weather data for each plot
- 6 sample alerts with different severity levels

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📁 Project Structure

```
SIH2026/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seed script
│   ├── api/                # Vercel serverless functions
│   └── package.json
├── shared/                  # Shared utilities
├── .gitignore
├── LICENSE
└── README.md
```

## 🔒 Security Features

- Environment variable management
- CORS configuration
- Input validation
- SQL injection prevention (Prisma ORM)
- Error handling without sensitive data exposure
- Rate limiting ready

## 🌍 Regional Focus

Currently optimized for Maharashtra, India with:
- Regional coordinate defaults
- Local crop types (wheat, cotton, soybean, etc.)
- Maharashtra-specific demo data
- Regional weather patterns

Easy to adapt for other regions by modifying:
- Default map coordinates
- Crop type enums
- Demo data locations
- Weather service locations

## 🤝 Contributing

This is a hackathon project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🏆 Smart India Hackathon 2026

**Problem Statement**: Satellite-based crop health monitoring and early warning system for farmers

**Solution**: A comprehensive platform that combines satellite imagery, weather data, and AI analysis to provide farmers with actionable insights for crop management and risk mitigation.

**Impact**: 
- Empowers smallholder farmers with space technology
- Enables proactive decision-making
- Reduces crop losses through early warnings
- Provides data-driven agricultural insights

## 📧 Contact

- **Developer**: Gyanankur Baruah
- **GitHub**: [@Gyanankur23](https://github.com/Gyanankur23)
- **Project**: [SIH2026](https://github.com/Gyanankur23/SIH2026)

## 🙏 Acknowledgments

- Sentinel Hub / Copernicus for satellite imagery access
- OpenWeather for weather data
- OpenStreetMap for map tiles
- Smart India Hackathon 2026 organizers

---

**Built with ❤️ for Indian Farmers**

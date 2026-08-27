import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'analysis'>('overview');
  const [selectedPlot, setSelectedPlot] = useState<any>(null);

  // Demo data - will be replaced with API calls
  const plots = [
    {
      id: 1,
      name: 'North Field - Wheat',
      location: 'Nashik, Maharashtra',
      coordinates: [[19.9975, 73.7897], [20.0075, 73.7897], [20.0075, 73.7997], [19.9975, 73.7997]],
      crop: 'Wheat',
      area: 2.5,
      health: 'Good',
      ndvi: 0.72,
      lastUpdated: '2026-08-25',
    },
    {
      id: 2,
      name: 'South Field - Cotton',
      location: 'Nashik, Maharashtra',
      coordinates: [[19.9875, 73.7797], [19.9975, 73.7797], [19.9975, 73.7897], [19.9875, 73.7897]],
      crop: 'Cotton',
      area: 1.8,
      health: 'Moderate',
      ndvi: 0.58,
      lastUpdated: '2026-08-25',
    },
  ];

  const ndviData = [
    { date: 'Aug 01', ndvi: 0.65, rainfall: 45 },
    { date: 'Aug 08', ndvi: 0.68, rainfall: 52 },
    { date: 'Aug 15', ndvi: 0.71, rainfall: 38 },
    { date: 'Aug 22', ndvi: 0.72, rainfall: 41 },
    { date: 'Aug 25', ndvi: 0.70, rainfall: 55 },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Moisture Stress',
      severity: 'medium',
      message: 'Moisture stress detected in northwest corner of plot',
      plotId: 2,
      timestamp: '2026-08-25T14:30:00Z',
    },
    {
      id: 2,
      type: 'Weather Alert',
      severity: 'high',
      message: 'Heavy rainfall expected in 3 days; risk of waterlogging',
      plotId: 1,
      timestamp: '2026-08-25T10:15:00Z',
    },
  ];

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'good': return 'text-leaf-600 bg-leaf-100';
      case 'moderate': return 'text-harvest-600 bg-harvest-100';
      case 'poor': return 'text-risk-high bg-risk-high/20';
      default: return 'text-earth-600 bg-earth-100';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'alert-low';
      case 'medium': return 'alert-medium';
      case 'high': return 'alert-high';
      case 'critical': return 'alert-critical';
      default: return 'alert-low';
    }
  };

  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-earth-600">Monitor your crop health and receive early warnings</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {['overview', 'register', 'analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-leaf-600 text-white shadow-md'
                  : 'text-earth-600 hover:bg-earth-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-earth-600 text-sm">Total Plots</p>
                    <p className="text-3xl font-bold text-earth-900">{plots.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-earth-600 text-sm">Total Area</p>
                    <p className="text-3xl font-bold text-earth-900">{plots.reduce((acc, p) => acc + p.area, 0).toFixed(1)} ha</p>
                  </div>
                  <div className="w-12 h-12 bg-soil-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-earth-600 text-sm">Avg NDVI</p>
                    <p className="text-3xl font-bold text-earth-900">
                      {(plots.reduce((acc, p) => acc + p.ndvi, 0) / plots.length).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-harvest-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-earth-600 text-sm">Active Alerts</p>
                    <p className="text-3xl font-bold text-risk-high">{recentAlerts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-risk-high/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Recent Alerts
              </h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-card ${getSeverityClass(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-earth-900">{alert.type}</h3>
                        <p className="text-earth-600 text-sm mt-1">{alert.message}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'high' ? 'bg-risk-high text-white' : 'bg-risk-medium text-earth-900'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plots List */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
                <span className="mr-2">🗺️</span> Your Plots
              </h2>
              <div className="grid gap-4">
                {plots.map((plot) => (
                  <div
                    key={plot.id}
                    className="border border-earth-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedPlot(plot)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-earth-900">{plot.name}</h3>
                        <p className="text-earth-600 text-sm">{plot.location}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-earth-600">🌱 {plot.crop}</span>
                          <span className="text-earth-600">📐 {plot.area} ha</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(plot.health)}`}>
                          {plot.health}
                        </span>
                        <p className="text-earth-600 text-sm mt-2">NDVI: {plot.ndvi.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Register Plot Tab */}
        {activeTab === 'register' && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-earth-900 mb-6 flex items-center">
              <span className="mr-2">📍</span> Register New Plot
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Plot Name</label>
                  <input type="text" className="input-field" placeholder="e.g., North Field - Wheat" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Crop Type</label>
                  <select className="input-field">
                    <option value="">Select crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="soybean">Soybean</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Area (hectares)</label>
                  <input type="number" step="0.1" className="input-field" placeholder="e.g., 2.5" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Location</label>
                  <input type="text" className="input-field" placeholder="e.g., Nashik, Maharashtra" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Plot Boundaries (Click on map to set coordinates)
                </label>
                <div className="h-96 rounded-lg overflow-hidden border border-earth-300">
                  <MapContainer center={[20.0, 73.79]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                  </MapContainer>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Register Plot
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && selectedPlot && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
                <span className="mr-2">🛰️</span> Satellite Imagery - {selectedPlot.name}
              </h2>
              <div className="h-96 rounded-lg overflow-hidden border border-earth-300 bg-earth-100 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🛰️</span>
                  <p className="text-earth-600">Satellite imagery will be displayed here</p>
                  <p className="text-earth-500 text-sm">Powered by Sentinel-2 data</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
                <span className="mr-2">📊</span> NDVI Trend Analysis
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ndviData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
                    <XAxis dataKey="date" stroke="#6b6375" />
                    <YAxis stroke="#6b6375" />
                    <Tooltip />
                    <Line type="monotone" dataKey="ndvi" stroke="#6bd56b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
                <span className="mr-2">🌡️</span> Weather Data
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-earth-50 rounded-lg">
                  <p className="text-earth-600 text-sm">Temperature</p>
                  <p className="text-2xl font-bold text-earth-900">28°C</p>
                </div>
                <div className="text-center p-4 bg-earth-50 rounded-lg">
                  <p className="text-earth-600 text-sm">Humidity</p>
                  <p className="text-2xl font-bold text-earth-900">65%</p>
                </div>
                <div className="text-center p-4 bg-earth-50 rounded-lg">
                  <p className="text-earth-600 text-sm">Rainfall (7d)</p>
                  <p className="text-2xl font-bold text-earth-900">45mm</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && !selectedPlot && (
          <div className="card p-12 text-center animate-fade-in">
            <span className="text-6xl mb-4 block">🗺️</span>
            <h2 className="text-xl font-bold text-earth-900 mb-2">Select a Plot</h2>
            <p className="text-earth-600">Choose a plot from the overview to view detailed analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;

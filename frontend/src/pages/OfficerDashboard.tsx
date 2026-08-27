import { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OfficerDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Demo data - will be replaced with API calls
  const regionalData = [
    { id: 1, name: 'Nashik District', plots: 245, highRisk: 12, moderateRisk: 38, avgNDVI: 0.68 },
    { id: 2, name: 'Pune District', plots: 312, highRisk: 8, moderateRisk: 25, avgNDVI: 0.71 },
    { id: 3, name: 'Ahmednagar District', plots: 189, highRisk: 15, moderateRisk: 42, avgNDVI: 0.62 },
    { id: 4, name: 'Aurangabad District', plots: 156, highRisk: 6, moderateRisk: 22, avgNDVI: 0.65 },
  ];

  const priorityPlots = [
    {
      id: 1,
      farmerName: 'Ramesh Patil',
      plotName: 'West Field - Soybean',
      location: 'Nashik',
      riskLevel: 'critical',
      ndvi: 0.42,
      issue: 'Severe moisture stress',
      lastUpdated: '2 hours ago',
      coordinates: [19.9975, 73.7897] as [number, number],
    },
    {
      id: 2,
      farmerName: 'Sunita Sharma',
      plotName: 'East Field - Cotton',
      location: 'Pune',
      riskLevel: 'high',
      ndvi: 0.51,
      issue: 'Possible pest infestation',
      lastUpdated: '5 hours ago',
      coordinates: [18.5204, 73.8567] as [number, number],
    },
    {
      id: 3,
      farmerName: 'Vijay Kumar',
      plotName: 'North Field - Wheat',
      location: 'Ahmednagar',
      riskLevel: 'high',
      ndvi: 0.48,
      issue: 'Nutrient deficiency detected',
      lastUpdated: '1 day ago',
      coordinates: [19.0948, 74.7396] as [number, number],
    },
    {
      id: 4,
      farmerName: 'Anjali Deshmukh',
      plotName: 'South Field - Sugarcane',
      location: 'Aurangabad',
      riskLevel: 'medium',
      ndvi: 0.58,
      issue: 'Growth rate below average',
      lastUpdated: '3 hours ago',
      coordinates: [19.8762, 75.3433] as [number, number],
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-risk-critical text-white';
      case 'high': return 'bg-risk-high text-white';
      case 'medium': return 'bg-risk-medium text-earth-900';
      case 'low': return 'bg-risk-low text-earth-900';
      default: return 'bg-earth-200 text-earth-900';
    }
  };

  const getRiskBorder = (level: string) => {
    switch (level) {
      case 'critical': return '#d00000';
      case 'high': return '#e85d04';
      case 'medium': return '#ffce40';
      case 'low': return '#6bd56b';
      default: return '#9a8f82';
    }
  };

  const filteredPlots = priorityPlots.filter(plot => {
    if (riskFilter === 'all') return true;
    return plot.riskLevel === riskFilter;
  });

  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-2">
            Officer Dashboard
          </h1>
          <p className="text-earth-600">Regional monitoring and risk prioritization for agricultural officers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Region</label>
            <select
              className="input-field"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              {regionalData.map(region => (
                <option key={region.id} value={region.name}>{region.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Risk Level</label>
            <select
              className="input-field"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="ml-auto">
            <button className="btn-secondary flex items-center space-x-2">
              <span>📥</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Regional Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {regionalData.map(region => (
            <div key={region.id} className="card p-6 hover:scale-105 transition-transform duration-200 cursor-pointer">
              <h3 className="font-bold text-earth-900 mb-3">{region.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-earth-600">Total Plots</span>
                  <span className="font-medium text-earth-900">{region.plots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">High Risk</span>
                  <span className="font-medium text-risk-high">{region.highRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Moderate Risk</span>
                  <span className="font-medium text-risk-medium">{region.moderateRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600">Avg NDVI</span>
                  <span className="font-medium text-leaf-600">{region.avgNDVI.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Plots Map */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
              <span className="mr-2">🗺️</span> Geographic Risk Distribution
            </h2>
            <div className="h-96 rounded-lg overflow-hidden border border-earth-300">
              <MapContainer center={[19.5, 74.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {filteredPlots.map(plot => (
                  <div key={plot.id}>
                    <Circle
                      center={plot.coordinates}
                      radius={5000}
                      pathOptions={{
                        color: getRiskBorder(plot.riskLevel),
                        fillColor: getRiskBorder(plot.riskLevel),
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">{plot.farmerName}</p>
                          <p>{plot.plotName}</p>
                          <p className="text-earth-600">{plot.issue}</p>
                          <p className="font-medium text-risk-high">Risk: {plot.riskLevel}</p>
                        </div>
                      </Popup>
                    </Circle>
                  </div>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Priority Plots List */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
              <span className="mr-2">🚨</span> Priority Action Required
              <span className="ml-auto text-sm font-normal text-earth-600">
                {filteredPlots.length} plots
              </span>
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPlots.map((plot) => (
                <div
                  key={plot.id}
                  className="border border-earth-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-earth-900">{plot.farmerName}</h3>
                      <p className="text-earth-600 text-sm">{plot.plotName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(plot.riskLevel)}`}>
                      {plot.riskLevel}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-earth-600">
                      <span className="font-medium">Issue:</span> {plot.issue}
                    </p>
                    <p className="text-earth-600">
                      <span className="font-medium">Location:</span> {plot.location}
                    </p>
                    <div className="flex items-center space-x-4 text-earth-600">
                      <span>NDVI: <span className="font-medium">{plot.ndvi.toFixed(2)}</span></span>
                      <span>Updated: {plot.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <button className="btn-primary text-sm py-1 px-3">View Details</button>
                    <button className="btn-secondary text-sm py-1 px-3">Contact Farmer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="card p-6 mt-6">
          <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
            <span className="mr-2">📊</span> Regional Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-earth-50 rounded-lg">
              <p className="text-3xl font-bold text-earth-900">{regionalData.reduce((acc, r) => acc + r.plots, 0)}</p>
              <p className="text-earth-600 text-sm">Total Plots Monitored</p>
            </div>
            <div className="text-center p-4 bg-risk-high/10 rounded-lg">
              <p className="text-3xl font-bold text-risk-high">{regionalData.reduce((acc, r) => acc + r.highRisk, 0)}</p>
              <p className="text-earth-600 text-sm">Critical Risk Plots</p>
            </div>
            <div className="text-center p-4 bg-risk-medium/10 rounded-lg">
              <p className="text-3xl font-bold text-risk-medium">{regionalData.reduce((acc, r) => acc + r.moderateRisk, 0)}</p>
              <p className="text-earth-600 text-sm">Moderate Risk Plots</p>
            </div>
            <div className="text-center p-4 bg-leaf-50 rounded-lg">
              <p className="text-3xl font-bold text-leaf-600">
                {(regionalData.reduce((acc, r) => acc + r.avgNDVI, 0) / regionalData.length).toFixed(2)}
              </p>
              <p className="text-earth-600 text-sm">Average NDVI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;

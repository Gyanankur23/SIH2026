import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useAuth } from '../contexts/AuthContext';
import { alertAPI } from '../services/api';

const OfficerDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [plots, setPlots] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadOfficerData();
  }, [isAuthenticated, selectedRegion, riskFilter]);

  const loadOfficerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const alertsResponse = await alertAPI.getAll({ 
        limit: 50, 
        resolved: false 
      });
      
      const alertsData = alertsResponse.data || [];
      
      // Check if alertsData is an array
      if (!Array.isArray(alertsData)) {
        console.error('Alerts data is not an array:', alertsData);
        setAlerts([]);
        setPlots([]);
        return;
      }
      
      setAlerts(alertsData);

      // Extract unique plots from alerts
      const uniquePlots = alertsData.reduce((acc: any[], alert: any) => {
        if (!acc.find((p: any) => p.id === alert.plotId)) {
          acc.push({
            id: alert.plotId,
            name: alert.plot?.name || 'Unknown Plot',
            location: alert.plot?.location || 'Unknown Location',
            cropType: alert.plot?.cropType || 'Unknown',
            farmerId: alert.plot?.farmerId || '',
            farmerName: alert.plot?.farmer?.name || 'Unknown Farmer',
            ndvi: alert.ndvi || 0.5,
            coordinates: alert.plot?.coordinates || { type: 'Point', coordinates: [20.0, 73.79] }
          });
        }
        return acc;
      }, []);

      let filteredPlots = uniquePlots;
      if (riskFilter !== 'all') {
        filteredPlots = uniquePlots.filter((plot: any) => {
          const plotAlerts = alertsData.filter((a: any) => a.plotId === plot.id);
          const highestSeverity = plotAlerts.length > 0 ? 
            plotAlerts.reduce((max: string, a: any) => 
              a.severity === 'critical' ? 'critical' : 
              a.severity === 'high' && max !== 'critical' ? 'high' : max, 
              'low'
            ) : 'low';
          return highestSeverity === riskFilter;
        });
      }

      setPlots(filteredPlots);
    } catch (err) {
      console.error('Error loading officer data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getRiskBorder = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#9ca3af';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the Officer Dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading regional data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadOfficerData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Officer Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Officer'} - Regional monitoring and risk prioritization</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              <option value="Nashik">Nashik District</option>
              <option value="Pune">Pune District</option>
              <option value="Ahmednagar">Ahmednagar District</option>
              <option value="Aurangabad">Aurangabad District</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-3">Nashik District</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monitored Plots</span>
                <span className="font-medium text-gray-900">{plots.filter(p => p.location.includes('Nashik')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk</span>
                <span className="font-medium text-red-600">{alerts.filter(a => a.severity === 'high' && a.plot?.location?.includes('Nashik')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moderate Risk</span>
                <span className="font-medium text-yellow-600">{alerts.filter(a => a.severity === 'medium' && a.plot?.location?.includes('Nashik')).length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-3">Pune District</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monitored Plots</span>
                <span className="font-medium text-gray-900">{plots.filter(p => p.location.includes('Pune')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk</span>
                <span className="font-medium text-red-600">{alerts.filter(a => a.severity === 'high' && a.plot?.location?.includes('Pune')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moderate Risk</span>
                <span className="font-medium text-yellow-600">{alerts.filter(a => a.severity === 'medium' && a.plot?.location?.includes('Pune')).length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-3">Ahmednagar District</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monitored Plots</span>
                <span className="font-medium text-gray-900">{plots.filter(p => p.location.includes('Ahmednagar')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk</span>
                <span className="font-medium text-red-600">{alerts.filter(a => a.severity === 'high' && a.plot?.location?.includes('Ahmednagar')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moderate Risk</span>
                <span className="font-medium text-yellow-600">{alerts.filter(a => a.severity === 'medium' && a.plot?.location?.includes('Ahmednagar')).length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-3">Aurangabad District</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monitored Plots</span>
                <span className="font-medium text-gray-900">{plots.filter(p => p.location.includes('Aurangabad')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk</span>
                <span className="font-medium text-red-600">{alerts.filter(a => a.severity === 'high' && a.plot?.location?.includes('Aurangabad')).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moderate Risk</span>
                <span className="font-medium text-yellow-600">{alerts.filter(a => a.severity === 'medium' && a.plot?.location?.includes('Aurangabad')).length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Geographic Risk Distribution</h2>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
              <MapContainer center={[19.5, 74.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {plots.map((plot) => {
                  const plotAlerts = alerts.filter(a => a.plotId === plot.id);
                  const highestSeverity = plotAlerts.length > 0 ? 
                    plotAlerts.reduce((max: string, a: any) => 
                      a.severity === 'critical' ? 'critical' : 
                      a.severity === 'high' && max !== 'critical' ? 'high' : max, 
                      'low'
                    ) : 'low';
                  
                  return (
                    <Circle
                      key={plot.id}
                      center={plot.coordinates.coordinates}
                      radius={5000}
                      pathOptions={{
                        color: getRiskBorder(highestSeverity),
                        fillColor: getRiskColor(highestSeverity),
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">{plot.name}</p>
                          <p>{plot.location}</p>
                          <p>Farmer: {plot.farmerName}</p>
                          <p>Risk Level: <span className="font-medium capitalize">{highestSeverity}</span></p>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Priority Action Required
              <span className="ml-auto text-sm font-normal text-gray-600">
                {plots.length} plots
              </span>
            </h2>
            {plots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No plots requiring attention</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {plots.map((plot) => {
                  const plotAlerts = alerts.filter(a => a.plotId === plot.id);
                  const highestSeverity = plotAlerts.length > 0 ? 
                    plotAlerts.reduce((max: string, a: any) => 
                      a.severity === 'critical' ? 'critical' : 
                      a.severity === 'high' && max !== 'critical' ? 'high' : max, 
                      'low'
                    ) : 'low';

                  return (
                    <div
                      key={plot.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{plot.farmerName}</h3>
                          <p className="text-gray-600 text-sm">{plot.name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          highestSeverity === 'critical' ? 'bg-red-500 text-white' : 
                          highestSeverity === 'high' ? 'bg-orange-500 text-white' : 
                          highestSeverity === 'medium' ? 'bg-yellow-500 text-gray-900' : 
                          'bg-green-500 text-white'
                        }`}>
                          {highestSeverity}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Issue:</span> {plotAlerts[0]?.message || 'Multiple alerts'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {plot.location}
                        </p>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span>NDVI: <span className="font-medium">{plot.ndvi.toFixed(2)}</span></span>
                          <span>Alerts: <span className="font-medium">{plotAlerts.length}</span></span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                          View Details
                        </button>
                        <button className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700">
                          Contact Farmer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{plots.length}</p>
              <p className="text-gray-600 text-sm">Total Plots Monitored</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{alerts.filter(a => a.severity === 'critical').length}</p>
              <p className="text-gray-600 text-sm">Critical Risk Plots</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{alerts.filter(a => a.severity === 'high').length}</p>
              <p className="text-gray-600 text-sm">High Risk Plots</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {plots.length > 0 ? (plots.reduce((sum, p) => sum + p.ndvi, 0) / plots.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-gray-600 text-sm">Average NDVI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;

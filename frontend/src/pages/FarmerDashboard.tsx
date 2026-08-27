import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { plotAPI, alertAPI, analysisAPI } from '../services/api';

const FarmerDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'analysis'>('overview');
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  const [plots, setPlots] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [newPlot, setNewPlot] = useState({
    name: '',
    cropType: '',
    area: '',
    location: '',
    soilType: '',
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadFarmerData();
  }, [isAuthenticated]);

  const loadFarmerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) return;

      const [plotsResponse, alertsResponse] = await Promise.all([
        plotAPI.getByFarmer(user.id),
        alertAPI.getAll({ limit: 10, resolved: false })
      ]);

      setPlots(plotsResponse.data || []);
      setAlerts(alertsResponse.data || []);
    } catch (err) {
      console.error('Error loading farmer data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlotSelect = async (plot: any) => {
    setSelectedPlot(plot);
    try {
      const analysis = await analysisAPI.analyze(plot.id);
      setAnalysisData(analysis.data);
    } catch (err) {
      console.error('Error loading analysis:', err);
    }
  };

  const handleRegisterPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const plotData = {
        ...newPlot,
        area: parseFloat(newPlot.area),
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [73.7897, 19.9975],
            [73.7997, 19.9975],
            [73.7997, 20.0075],
            [73.7897, 20.0075],
            [73.7897, 19.9975]
          ]]
        }
      };

      await plotAPI.register(plotData);
      setNewPlot({ name: '', cropType: '', area: '', location: '', soilType: '' });
      loadFarmerData();
    } catch (err) {
      console.error('Error registering plot:', err);
      alert('Failed to register plot. Please try again.');
    }
  };

  const handleAlertResolve = async (alertId: string) => {
    try {
      await alertAPI.resolve(alertId);
      loadFarmerData();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-4 border-green-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'critical': return 'border-l-4 border-red-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the Farmer Dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
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
          <button onClick={loadFarmerData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Farmer'} - Monitor your crop health and receive early warnings</p>
        </div>

        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {['overview', 'register', 'analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Plots</p>
                    <p className="text-3xl font-bold text-gray-900">{plots.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">P</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Area</p>
                    <p className="text-3xl font-bold text-gray-900">{plots.reduce((acc, p) => acc + p.area, 0).toFixed(1)} ha</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">A</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg NDVI</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {plots.length > 0 ? (plots.reduce((acc, p) => acc + (p.ndvi || 0), 0) / plots.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">N</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Alerts</p>
                    <p className="text-3xl font-bold text-red-600">{alerts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active alerts</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`bg-gray-50 rounded-lg p-4 ${getSeverityClass(alert.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{alert.type}</h3>
                          <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'high' ? 'bg-orange-500 text-white' : 
                          alert.severity === 'critical' ? 'bg-red-500 text-white' : 
                          'bg-yellow-500 text-gray-900'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleAlertResolve(alert.id)}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Plots</h2>
                <button 
                  onClick={() => setActiveTab('register')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Register New Plot
                </button>
              </div>
              {plots.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No plots registered yet</p>
              ) : (
                <div className="grid gap-4">
                  {plots.map((plot) => (
                    <div
                      key={plot.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => handlePlotSelect(plot)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{plot.name}</h3>
                          <p className="text-gray-600 text-sm">{plot.location}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-600">Crop: {plot.cropType}</span>
                            <span className="text-gray-600">Area: {plot.area} ha</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(plot.health || 'moderate')}`}>
                            {plot.health || 'Moderate'}
                          </span>
                          <p className="text-gray-600 text-sm mt-2">NDVI: {(plot.ndvi || 0.5).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Register New Plot</h2>
            
            <form onSubmit={handleRegisterPlot} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plot Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., North Field - Wheat"
                    value={newPlot.name}
                    onChange={(e) => setNewPlot({...newPlot, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlot.cropType}
                    onChange={(e) => setNewPlot({...newPlot, cropType: e.target.value})}
                    required
                  >
                    <option value="">Select crop</option>
                    <option value="WHEAT">Wheat</option>
                    <option value="RICE">Rice</option>
                    <option value="COTTON">Cotton</option>
                    <option value="SUGARCANE">Sugarcane</option>
                    <option value="SOYBEAN">Soybean</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 2.5"
                    value={newPlot.area}
                    onChange={(e) => setNewPlot({...newPlot, area: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Nashik, Maharashtra"
                    value={newPlot.location}
                    onChange={(e) => setNewPlot({...newPlot, location: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Black Soil"
                    value={newPlot.soilType}
                    onChange={(e) => setNewPlot({...newPlot, soilType: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Boundaries (Click on map to set coordinates)
                </label>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                  <MapContainer center={[20.0, 73.79]} zoom={7} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                  </MapContainer>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                  Register Plot
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'analysis' && selectedPlot && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Plot Analysis: {selectedPlot.name}</h2>
              
              {analysisData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Current NDVI</p>
                      <p className="text-2xl font-bold text-gray-900">{analysisData.currentNDVI?.toFixed(3) || 'N/A'}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Health Score</p>
                      <p className="text-2xl font-bold text-gray-900">{analysisData.healthScore || 'N/A'}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Trend</p>
                      <p className="text-2xl font-bold text-gray-900 capitalize">{analysisData.ndviTrend || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="h-96 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600">Satellite imagery will be displayed here</p>
                      <p className="text-gray-500 text-sm">Provider: {analysisData.satelliteImagery?.provider || 'Loading...'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading analysis data...</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">NDVI Trend Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData?.historicalData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="ndvi" stroke="#16a34a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Weather Data</h2>
              {analysisData?.weatherData ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Temperature</p>
                    <p className="text-2xl font-bold text-gray-900">{analysisData.weatherData.current?.temperature?.toFixed(1) || 'N/A'}°C</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Humidity</p>
                    <p className="text-2xl font-bold text-gray-900">{analysisData.weatherData.current?.humidity?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Rainfall (7d)</p>
                    <p className="text-2xl font-bold text-gray-900">{analysisData.weatherData.current?.rainfall?.toFixed(1) || 'N/A'}mm</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Weather data loading...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && !selectedPlot && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Plot</h2>
            <p className="text-gray-600">Choose a plot from the overview to view detailed analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;

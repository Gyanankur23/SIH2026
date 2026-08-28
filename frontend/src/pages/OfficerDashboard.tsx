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
  const [activePlotModal, setActivePlotModal] = useState<any | null>(null);
  const [activeFarmerModal, setActiveFarmerModal] = useState<any | null>(null);

  const handleExportReport = () => {
    if (plots.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['Plot Name', 'Farmer Name', 'Location', 'Crop Type', 'NDVI', 'Total Alerts'];
    const rows = plots.map(p => {
      const plotAlerts = alerts.filter(a => a.plotId === p.id);
      return [
        `"${p.name}"`,
        `"${p.farmerName}"`,
        `"${p.location}"`,
        `"${p.cropType}"`,
        p.ndvi.toFixed(2),
        plotAlerts.length
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CropGuard_Regional_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const alertsResponse = await Promise.race([
        alertAPI.getAll({ limit: 50, resolved: false }), 
        timeoutPromise
      ]);
      
      const alertsData = (alertsResponse as any).data || [];
      
      // Check if alertsData is an array
      if (!Array.isArray(alertsData)) {
        console.error('Alerts data is not an array:', alertsData);
        setAlerts([]);
        setPlots([]);
        return;
      }
      
      // Filter alerts by officer's region
      const officerRegion = user?.region;
      let filteredAlerts = alertsData;
      if (officerRegion && officerRegion !== 'All Maharashtra') {
        filteredAlerts = alertsData.filter((alert: any) => {
          const location = alert.plot?.location || '';
          return location.includes(officerRegion);
        });
      }
      
      setAlerts(filteredAlerts);

      // Extract unique plots from alerts
      const uniquePlots = filteredAlerts.reduce((acc: any[], alert: any) => {
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
          const plotAlerts = filteredAlerts.filter((a: any) => a.plotId === plot.id);
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
            <button 
              onClick={handleExportReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
            >
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
                        <button 
                          onClick={() => setActivePlotModal(plot)}
                          className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700 font-medium"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => setActiveFarmerModal(plot)}
                          className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700 font-medium"
                        >
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

      {/* Plot Details Modal */}
      {activePlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setActivePlotModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{activePlotModal.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{activePlotModal.location} &bull; Farmer: {activePlotModal.farmerName}</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Crop Type:</span> {activePlotModal.cropType}</div>
                <div><span className="font-semibold">NDVI Index:</span> {activePlotModal.ndvi.toFixed(2)}</div>
                <div><span className="font-semibold">Farmer ID:</span> {activePlotModal.farmerId}</div>
                <div><span className="font-semibold">Plot ID:</span> {activePlotModal.id}</div>
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-gray-900 mb-2">Active Alerts on Plot:</h4>
                {alerts.filter(a => a.plotId === activePlotModal.id).map(a => (
                  <div key={a.id} className="p-3 mb-2 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="font-bold text-red-900 text-xs uppercase">{a.type} ({a.severity})</p>
                    <p className="text-xs text-red-800 mt-1">{a.message}</p>
                    {a.recommendation && (
                      <p className="text-xs font-medium text-red-900 mt-1">Recommendation: {a.recommendation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActivePlotModal(null)}
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Farmer Modal */}
      {activeFarmerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button 
              onClick={() => setActiveFarmerModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Contact Farmer</h3>
            <p className="text-sm text-gray-500 mb-4">{activeFarmerModal.farmerName}</p>
            <div className="space-y-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
              <p><span className="font-semibold">Farmer:</span> {activeFarmerModal.farmerName}</p>
              <p><span className="font-semibold">Location:</span> {activeFarmerModal.location}</p>
              <p><span className="font-semibold">Plot:</span> {activeFarmerModal.name}</p>
              <p><span className="font-semibold">Phone:</span> +91 98765 43210 (Demo Contact)</p>
            </div>
            <div className="mt-6 flex space-x-3 justify-end">
              <a
                href="tel:+919876543210"
                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 font-medium inline-block text-center"
              >
                Call Farmer
              </a>
              <button 
                onClick={() => setActiveFarmerModal(null)}
                className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;

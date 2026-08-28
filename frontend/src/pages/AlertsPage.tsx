import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { alertAPI } from '../services/api';

const AlertsPage = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadAlerts();
  }, [isAuthenticated, filter, timeRange]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (filter !== 'all') {
        filters.severity = filter;
      }
      filters.limit = 100;

      const response = await alertAPI.getAll(filters);
      const alertsData = response.data || [];
      
      // Check if data is an array
      if (!Array.isArray(alertsData)) {
        console.error('Alerts data is not an array:', alertsData);
        setAlerts([]);
      } else {
        setAlerts(alertsData);
      }
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError('Failed to load alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertResolve = async (alertId: string) => {
    try {
      await alertAPI.resolve(alertId);
      loadAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-gray-900';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MOISTURE_STRESS': return 'Moisture Stress';
      case 'WEATHER_ALERT': return 'Weather Alert';
      case 'NUTRIENT_DEFICIENCY': return 'Nutrient Deficiency';
      case 'PEST_INFESTATION': return 'Pest Infestation';
      case 'DISEASE_RISK': return 'Disease Risk';
      case 'GROWTH_ANOMALY': return 'Growth Anomaly';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the Alerts page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Alerts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadAlerts} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Warnings</h1>
          <p className="text-gray-600">Real-time crop health alerts and early warning notifications</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Showing {alerts.length} alerts
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.severity === 'medium').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low</p>
                <p className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.severity === 'low').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">i</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Alerts Found</h2>
              <p className="text-gray-600">No alerts match your current filter criteria</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow p-4 ${getSeverityClass(alert.severity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-900">{getTypeLabel(alert.type)}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{alert.plot?.name || 'Unknown Plot'}</p>
                    <p className="text-gray-500 text-xs">{alert.plot?.farmer?.name || 'Unknown Farmer'} - {alert.plot?.location || 'Unknown Location'}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{getTimeAgo(alert.timestamp)}</p>
                    <p className="text-xs">{formatDate(alert.timestamp)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 mb-2">{alert.message}</p>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">Recommendation:</span> {alert.recommendation || 'Monitor closely'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>NDVI: <span className="font-medium">{alert.ndvi?.toFixed(2) || 'N/A'}</span></span>
                    <span>Plot ID: <span className="font-medium text-xs">{alert.plotId}</span></span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleAlertResolve(alert.id)}
                      className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-gray-900">SMS Alerts</p>
                <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-gray-900">WhatsApp Notifications</p>
                <p className="text-sm text-gray-600">Get alerts on WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-gray-900">Email Digest</p>
                <p className="text-sm text-gray-600">Daily summary via email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;

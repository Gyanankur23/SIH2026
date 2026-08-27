import { useState } from 'react';

const AlertsPage = () => {
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');

  // Demo data - will be replaced with API calls
  const alerts = [
    {
      id: 1,
      type: 'Moisture Stress',
      severity: 'medium',
      plotName: 'South Field - Cotton',
      farmerName: 'Sunita Sharma',
      location: 'Nashik, Maharashtra',
      message: 'Moisture stress detected in northwest corner of plot. Current soil moisture levels are 15% below optimal for this growth stage.',
      recommendation: 'Consider irrigation within 24-48 hours. Monitor soil moisture sensors daily.',
      timestamp: '2026-08-25T14:30:00Z',
      ndvi: 0.58,
      coordinates: { lat: 19.9875, lng: 73.7797 },
    },
    {
      id: 2,
      type: 'Weather Alert',
      severity: 'high',
      plotName: 'North Field - Wheat',
      farmerName: 'Ramesh Patil',
      location: 'Nashik, Maharashtra',
      message: 'Heavy rainfall expected in 3 days; risk of waterlogging. Weather forecast predicts 80mm precipitation over 48 hours.',
      recommendation: 'Ensure proper drainage systems. Consider harvest if crops are mature. Prepare flood mitigation measures.',
      timestamp: '2026-08-25T10:15:00Z',
      ndvi: 0.72,
      coordinates: { lat: 19.9975, lng: 73.7897 },
    },
    {
      id: 3,
      type: 'Nutrient Deficiency',
      severity: 'high',
      plotName: 'East Field - Soybean',
      farmerName: 'Vijay Kumar',
      location: 'Pune, Maharashtra',
      message: 'Nitrogen deficiency detected through spectral analysis. Leaf yellowing patterns indicate insufficient nitrogen levels.',
      recommendation: 'Apply nitrogen fertilizer at recommended rate. Consider foliar application for quick absorption. Retest in 7 days.',
      timestamp: '2026-08-24T16:45:00Z',
      ndvi: 0.51,
      coordinates: { lat: 18.5204, lng: 73.8567 },
    },
    {
      id: 4,
      type: 'Pest Infestation Risk',
      severity: 'medium',
      plotName: 'West Field - Sugarcane',
      farmerName: 'Anjali Deshmukh',
      location: 'Ahmednagar, Maharashtra',
      message: 'Conditions favorable for armyworm infestation. Current temperature and humidity patterns match historical outbreak conditions.',
      recommendation: 'Implement preventive pest control measures. Increase monitoring frequency. Prepare biological control agents.',
      timestamp: '2026-08-24T09:20:00Z',
      ndvi: 0.62,
      coordinates: { lat: 19.0948, lng: 74.7396 },
    },
    {
      id: 5,
      type: 'Growth Anomaly',
      severity: 'low',
      plotName: 'Central Field - Rice',
      farmerName: 'Dilip Singh',
      location: 'Aurangabad, Maharashtra',
      message: 'Growth rate 5% below regional average for this time of year. No immediate cause for concern but worth monitoring.',
      recommendation: 'Continue normal cultivation practices. Compare with neighboring fields. Investigate if deviation persists beyond 14 days.',
      timestamp: '2026-08-23T11:00:00Z',
      ndvi: 0.68,
      coordinates: { lat: 19.8762, lng: 75.3433 },
    },
    {
      id: 6,
      type: 'Disease Risk',
      severity: 'critical',
      plotName: 'South-East Field - Tomato',
      farmerName: 'Meena Reddy',
      location: 'Nashik, Maharashtra',
      message: 'Early blight risk identified. Weather conditions (high humidity, moderate temperatures) are conducive to disease development.',
      recommendation: 'URGENT: Apply fungicide treatment immediately. Remove affected plant material. Improve air circulation through spacing.',
      timestamp: '2026-08-23T08:30:00Z',
      ndvi: 0.45,
      coordinates: { lat: 19.9775, lng: 73.7697 },
    },
  ];

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'alert-low';
      case 'medium': return 'alert-medium';
      case 'high': return 'alert-high';
      case 'critical': return 'alert-critical';
      default: return 'alert-low';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-risk-low text-earth-900';
      case 'medium': return 'bg-risk-medium text-earth-900';
      case 'high': return 'bg-risk-high text-white';
      case 'critical': return 'bg-risk-critical text-white';
      default: return 'bg-earth-200 text-earth-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Moisture Stress': return '💧';
      case 'Weather Alert': return '🌧️';
      case 'Nutrient Deficiency': return '🌱';
      case 'Pest Infestation Risk': return '🐛';
      case 'Growth Anomaly': return '📊';
      case 'Disease Risk': return '🍂';
      default: return '⚠️';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

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

  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-2">
            Alerts & Warnings
          </h1>
          <p className="text-earth-600">Real-time crop health alerts and early warning notifications</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Severity</label>
            <select
              className="input-field"
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
            <label className="block text-sm font-medium text-earth-700 mb-1">Time Range</label>
            <select
              className="input-field"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-earth-600">
              Showing {filteredAlerts.length} alerts
            </div>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-600 text-sm">Critical</p>
                <p className="text-2xl font-bold text-risk-critical">
                  {alerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-risk-critical/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🚨</span>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-600 text-sm">High</p>
                <p className="text-2xl font-bold text-risk-high">
                  {alerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-risk-high/20 rounded-full flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-600 text-sm">Medium</p>
                <p className="text-2xl font-bold text-risk-medium">
                  {alerts.filter(a => a.severity === 'medium').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-risk-medium/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🔔</span>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-earth-600 text-sm">Low</p>
                <p className="text-2xl font-bold text-risk-low">
                  {alerts.filter(a => a.severity === 'low').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-risk-low/20 rounded-full flex items-center justify-center">
                <span className="text-xl">ℹ️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${getSeverityClass(alert.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{getTypeIcon(alert.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-earth-900">{alert.type}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-earth-600 text-sm">{alert.plotName}</p>
                    <p className="text-earth-500 text-xs">{alert.farmerName} • {alert.location}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-earth-500">
                  <p>{getTimeAgo(alert.timestamp)}</p>
                  <p className="text-xs">{formatDate(alert.timestamp)}</p>
                </div>
              </div>

              <div className="bg-earth-50 rounded-lg p-4 mb-3">
                <p className="text-earth-700 mb-2">{alert.message}</p>
                <div className="border-t border-earth-200 pt-2 mt-2">
                  <p className="text-sm">
                    <span className="font-medium text-earth-900">Recommendation:</span> {alert.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-earth-600">
                  <span>NDVI: <span className="font-medium">{alert.ndvi.toFixed(2)}</span></span>
                  <span>Lat: {alert.coordinates.lat.toFixed(4)}, Lng: {alert.coordinates.lng.toFixed(4)}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-primary text-sm py-1 px-3">View Details</button>
                  <button className="btn-secondary text-sm py-1 px-3">Mark Resolved</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="card p-12 text-center">
            <span className="text-6xl mb-4 block">✅</span>
            <h2 className="text-xl font-bold text-earth-900 mb-2">No Alerts Found</h2>
            <p className="text-earth-600">No alerts match your current filter criteria</p>
          </div>
        )}

        {/* Notification Settings */}
        <div className="card p-6 mt-6">
          <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center">
            <span className="mr-2">🔔</span> Notification Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-earth-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-leaf-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-earth-900">SMS Alerts</p>
                <p className="text-sm text-earth-600">Receive critical alerts via SMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-earth-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-leaf-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-earth-900">WhatsApp Notifications</p>
                <p className="text-sm text-earth-600">Get alerts on WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-earth-50 rounded-lg">
              <input type="checkbox" className="w-5 h-5 text-leaf-600 rounded" defaultChecked />
              <div>
                <p className="font-medium text-earth-900">Email Digest</p>
                <p className="text-sm text-earth-600">Daily summary via email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;

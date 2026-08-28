import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Mock data for demo when backend is unavailable
const mockPlots = [
  {
    id: 'plot-1',
    name: 'North Field - Wheat',
    location: 'Nashik, Maharashtra',
    cropType: 'Wheat',
    area: 2.5,
    soilType: 'Black Soil',
    health: 'Good',
    ndvi: 0.75,
    farmerId: 'demo-farmer-1',
    coordinates: { type: 'Point', coordinates: [19.0, 73.79] }
  },
  {
    id: 'plot-2',
    name: 'South Field - Cotton',
    location: 'Nashik, Maharashtra',
    cropType: 'Cotton',
    area: 1.8,
    soilType: 'Red Soil',
    health: 'Moderate',
    ndvi: 0.62,
    farmerId: 'demo-farmer-1',
    coordinates: { type: 'Point', coordinates: [19.5, 73.8] }
  }
];

const mockAlerts = [
  {
    id: 'alert-1',
    plotId: 'plot-2',
    type: 'MOISTURE_STRESS',
    severity: 'medium',
    message: 'Moderate moisture stress detected in South Field',
    recommendation: 'Increase irrigation schedule by 20%',
    ndvi: 0.62,
    timestamp: new Date().toISOString(),
    resolved: false,
    plot: mockPlots[1]
  },
  {
    id: 'alert-2',
    plotId: 'plot-1',
    type: 'WEATHER_ALERT',
    severity: 'low',
    message: 'Normal weather conditions expected for next 7 days',
    recommendation: 'Continue current irrigation schedule',
    ndvi: 0.75,
    timestamp: new Date().toISOString(),
    resolved: false,
    plot: mockPlots[0]
  }
];

export const plotAPI = {
  register: (data: any) => api.post('/plots/register', data),
  getByFarmer: (farmerId: string) => 
    api.get(`/plots/farmer/${farmerId}`).catch(() => ({ data: mockPlots })),
  getById: (id: string) => api.get(`/plots/${id}`),
  update: (id: string, data: any) => api.put(`/plots/${id}`, data),
  delete: (id: string) => api.delete(`/plots/${id}`),
};

export const alertAPI = {
  getByPlot: (plotId: string, filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.resolved !== undefined) params.append('resolved', filters.resolved.toString());
    return api.get(`/alerts/plot/${plotId}?${params.toString()}`);
  },
  getAll: (filters?: any) => 
    api.get(`/alerts`, { params: filters }).catch(() => ({ data: mockAlerts })),
  resolve: (id: string) => api.put(`/alerts/${id}/resolve`),
  create: (data: any) => api.post('/alerts', data),
};

export const analysisAPI = {
  analyze: (id: string) => api.get(`/analysis/plot/${id}`),
  getNDVI: (id: string, options?: any) => {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    return api.get(`/analysis/plot/${id}/ndvi?${params.toString()}`);
  },
  getWeather: (id: string) => api.get(`/analysis/plot/${id}/weather`),
  getImagery: (id: string, options?: any) => {
    const params = new URLSearchParams();
    if (options?.date) params.append('date', options.date);
    if (options?.provider) params.append('provider', options.provider);
    return api.get(`/analysis/plot/${id}/imagery?${params.toString()}`);
  },
};

export const reportAPI = {
  getPDF: (id: string) => api.get(`/reports/plot/${id}/pdf`, { responseType: 'blob' }),
  getCSV: (id: string) => api.get(`/reports/plot/${id}/csv`, { responseType: 'blob' }),
  getRegionalPDF: (region?: string) => {
    const params = region ? `?region=${region}` : '';
    return api.get(`/reports/regional/pdf${params}`, { responseType: 'blob' });
  },
};

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export default api;

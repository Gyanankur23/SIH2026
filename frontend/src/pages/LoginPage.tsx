import { useState } from 'react';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      
      // Store JWT token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      // Redirect based on role
      const dashboard = response.data.user.role === 'officer' ? 'officer-dashboard' : 'farmer-dashboard';
      window.location.hash = `#/${dashboard}`;
      window.location.reload();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CropGuard</h1>
          <p className="text-gray-600">Satellite-Based Crop Health Monitoring</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/signup';
                window.location.reload();
              }}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm font-medium">
            Demo Accounts
          </p>
          <div className="mt-3 space-y-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 text-xs font-semibold">Officers</p>
              <p className="text-gray-500 text-xs">officer@gmail.com / 12345</p>
              <p className="text-gray-500 text-xs">officer2@gmail.com / 12345</p>
              <p className="text-gray-500 text-xs">officer3@gmail.com / 12345</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 text-xs font-semibold">Farmers</p>
              <p className="text-gray-500 text-xs">farmer@gmail.com / 54321</p>
              <p className="text-gray-500 text-xs">sunita.sharma@example.com / 54321</p>
              <p className="text-gray-500 text-xs">vijay.kumar@example.com / 54321</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

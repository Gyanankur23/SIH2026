import { useState } from 'react';

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
      // Demo credentials
      if (email === 'officer@gmail.com' && password === '12345') {
        const demoUser = {
          id: 'officer-user-123',
          name: 'Officer User',
          email: email,
          role: 'officer'
        };
        
        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
        // Navigate to officer dashboard
        window.location.href = '/#/officer-dashboard';
      } else if (email === 'farmer@gmail.com' && password === '54321') {
        const demoUser = {
          id: 'farmer-user-456',
          name: 'Farmer User',
          email: email,
          role: 'farmer'
        };
        
        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user_data', JSON.stringify(demoUser));
        
        // Navigate to farmer dashboard
        window.location.href = '/#/farmer-dashboard';
      } else {
        setError('Invalid credentials. Please use the demo accounts.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
            Demo Accounts
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Officer: officer@gmail.com / 12345
          </p>
          <p className="text-gray-500 text-xs">
            Farmer: farmer@gmail.com / 54321
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

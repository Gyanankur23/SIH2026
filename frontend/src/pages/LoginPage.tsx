import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const targetPath = userData.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard';
      navigate(targetPath);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl shadow-md">
            CG
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">CropGuard</h1>
          <p className="text-gray-600 text-sm">Satellite-Based Crop Health Monitoring System</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded-r-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g. farmer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-medium text-green-600 hover:text-green-700 underline"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-700 text-xs font-bold uppercase tracking-wider text-center mb-3">
            Click to Auto-fill Demo Accounts
          </p>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-blue-900 text-xs font-semibold mb-1">Officer Accounts (Password: 12345)</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  { email: 'officer@gmail.com', label: 'Nashik Officer' },
                  { email: 'officer2@gmail.com', label: 'Pune Officer' },
                  { email: 'officer3@gmail.com', label: 'State Officer' },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email, '12345')}
                    className="bg-white text-blue-700 text-xs px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-green-900 text-xs font-semibold mb-1">Farmer Accounts (Password: 54321)</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  { email: 'farmer@gmail.com', label: 'Ramesh Patil' },
                  { email: 'sunita.sharma@example.com', label: 'Sunita Sharma' },
                  { email: 'vijay.kumar@example.com', label: 'Vijay Kumar' },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email, '54321')}
                    className="bg-white text-green-700 text-xs px-2.5 py-1 rounded border border-green-200 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

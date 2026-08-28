import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { logout, isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/farmer-dashboard', label: 'Farmer Dashboard', protected: true, role: 'farmer' },
    { path: '/officer-dashboard', label: 'Officer Dashboard', protected: true, role: 'officer' },
    { path: '/alerts', label: 'Alerts', protected: true },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/#/';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CG</span>
              </div>
              <span className="font-sans text-xl font-bold text-gray-900">
                CropGuard
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              if (item.role && user?.role !== item.role) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} border-t border-gray-200`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              if (item.role && user?.role !== item.role) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

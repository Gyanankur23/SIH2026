import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/farmer-dashboard', label: 'Farmer Dashboard', icon: '🌾' },
    { path: '/officer-dashboard', label: 'Officer Dashboard', icon: '👨‍💼' },
    { path: '/alerts', label: 'Alerts', icon: '⚠️' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-earth-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="font-display text-xl font-bold text-leaf-700">
                CropGuard
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-leaf-100 text-leaf-700'
                    : 'text-earth-600 hover:bg-earth-100 hover:text-earth-900'
                }`}
                aria-label={item.label}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg text-earth-600 hover:bg-earth-100"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden border-t border-earth-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                location.pathname === item.path
                  ? 'bg-leaf-100 text-leaf-700'
                  : 'text-earth-600 hover:bg-earth-100'
              }`}
              aria-label={item.label}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

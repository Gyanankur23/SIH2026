import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-earth-gradient">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-leaf-50 via-earth-50 to-harvest-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-leaf-100 rounded-full mb-8 shadow-lg">
              <span className="text-4xl">🛰️</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-earth-900 mb-6 text-shadow">
              Satellite-Based Crop Health Monitoring
              <span className="block text-leaf-600">and Early Warning System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-earth-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering farmers with real-time satellite imagery, AI-powered crop analysis, 
              and early warning alerts for proactive agricultural decision-making.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/farmer-dashboard"
                className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <span>🌾</span>
                <span>Farmer Dashboard</span>
              </Link>
              <Link
                to="/officer-dashboard"
                className="btn-secondary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <span>👨‍💼</span>
                <span>Officer Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 text-center mb-12">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-leaf-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛰️</span>
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">Satellite Imagery</h3>
              <p className="text-earth-600">
                Real-time monitoring using Sentinel-2 and Landsat data for precise crop health assessment.
              </p>
            </div>
            
            <div className="card p-6 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-harvest-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">NDVI Analysis</h3>
              <p className="text-earth-600">
                Advanced vegetation index calculations to detect stress patterns and growth anomalies.
              </p>
            </div>
            
            <div className="card p-6 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-soil-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">Early Alerts</h3>
              <p className="text-earth-600">
                Timely warnings for moisture stress, disease outbreaks, and adverse weather conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-leaf-600 mb-2">10M+</div>
              <div className="text-earth-600">Hectares Monitored</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-harvest-600 mb-2">50K+</div>
              <div className="text-earth-600">Farmers Served</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-soil-600 mb-2">98%</div>
              <div className="text-earth-600">Alert Accuracy</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-earth-600 mb-2">24/7</div>
              <div className="text-earth-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-leaf-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-leaf-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using CropGuard to protect their crops and maximize yields.
          </p>
          <Link
            to="/farmer-dashboard"
            className="inline-block bg-white text-leaf-700 font-bold px-8 py-3 rounded-lg hover:bg-leaf-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">
            <span className="text-2xl">🌱</span> CropGuard - Smart India Hackathon 2026
          </p>
          <p className="text-sm text-earth-400">
            Empowering Indian Agriculture with Space Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-yellow-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8 shadow-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">CG</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-gray-900 mb-6">
              NDVI-Based Crop Health Monitoring
              <span className="block text-green-600">and Early Warning System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering farmers with real-time NDVI heatmap visualization, vegetation index analysis, 
              and early warning alerts for proactive agricultural decision-making.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="bg-green-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">N</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">NDVI Heatmap</h3>
              <p className="text-gray-600">
                Real-time vegetation index visualization with animated heatmap display for precise crop health assessment.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">D</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">NDVI Analysis</h3>
              <p className="text-gray-600">
                Advanced vegetation index calculations to detect stress patterns and growth anomalies.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Early Alerts</h3>
              <p className="text-gray-600">
                Timely warnings for moisture stress, disease outbreaks, and adverse weather conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Hectares Monitored</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Farmers Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">6</div>
              <div className="text-gray-600">Active Plots</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-600 mb-2">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join farmers using CropGuard to monitor crop health with NDVI analysis and receive early warnings.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">
            <span className="font-bold text-white">CropGuard</span> - Smart India Hackathon 2026
          </p>
          <p className="text-sm text-gray-400">
            Empowering Indian Agriculture with Space Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

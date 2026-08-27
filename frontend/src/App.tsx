import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import AlertsPage from './pages/AlertsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-earth-gradient">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/officer-dashboard" element={<OfficerDashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

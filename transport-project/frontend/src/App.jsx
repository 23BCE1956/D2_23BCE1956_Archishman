import React, { useState } from 'react';
import Passenger from './pages/Passenger';
import Driver from './pages/Driver';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('passenger');
  const [driverVerified, setDriverVerified] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);

  const renderPage = () => {
    if (currentPage === 'passenger') return <Passenger />;
    if (currentPage === 'driver') {
      return (
        <Driver
          driverVerified={driverVerified}
          setDriverVerified={setDriverVerified}
        />
      );
    }
    if (currentPage === 'admin') {
      return (
        <Admin
          adminVerified={adminVerified}
          setAdminVerified={setAdminVerified}
        />
      );
    }
    return <Passenger />;
  };

  const getPageLabel = () => {
    if (currentPage === 'passenger') return 'Passenger overview';
    if (currentPage === 'driver') return 'Driver console';
    if (currentPage === 'admin') return 'Admin control';
    return '';
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title-group">
          <div className="app-title">Real-Time Public Transport Tracking</div>
          <div className="app-subtitle">
            Monitor buses, routes, and live locations in a single place.
          </div>
        </div>
        <div className="app-badge">Public Transport • Overview</div>
      </header>

      <nav className="app-nav">
        <button
          className={`app-nav-button ${currentPage === 'passenger' ? 'active' : ''}`}
          onClick={() => setCurrentPage('passenger')}
        >
          <span className="icon">👥</span>
          <span>Passenger</span>
        </button>
        <button
          className={`app-nav-button ${currentPage === 'driver' ? 'active' : ''}`}
          onClick={() => setCurrentPage('driver')}
        >
          <span className="icon">🧭</span>
          <span>Driver</span>
        </button>
        <button
          className={`app-nav-button ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={() => setCurrentPage('admin')}
        >
          <span className="icon">🛠</span>
          <span>Admin</span>
        </button>
      </nav>

      <div className="app-card" aria-label={getPageLabel()}>
        <div className="page-transition" key={currentPage}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;

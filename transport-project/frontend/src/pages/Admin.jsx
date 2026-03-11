import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function Admin({ adminVerified, setAdminVerified }) {
  const [buses, setBuses] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/buses`);
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
      alert('Failed to load buses');
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setVerifying(true);
    try {
      const { data } = await axios.post(`${API_URL}/verify-admin`, { password });
      if (data.ok) {
        setAdminVerified(true);
        setPassword('');
      } else {
        setPasswordError('Invalid password');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Invalid password');
    } finally {
      setVerifying(false);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();

    if (!busNumber.trim() || !routeNumber.trim()) {
      alert('Bus ID and Route name are required');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/buses`, {
        busNumber: busNumber.trim(),
        routeNumber: routeNumber.trim(),
      });
      alert('Bus added successfully');
      setBusNumber('');
      setRouteNumber('');
      fetchBuses();
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBus = async (id, busLabel) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${busLabel}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/buses/${id}`);
      alert('Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus');
    }
  };

  if (!adminVerified) {
    return (
      <div className="page page-grid-single">
        <div className="page-header">
          <div className="page-title-group">
            <h2 className="page-title">Admin access</h2>
            <p className="page-subtitle">Enter the admin password to continue.</p>
          </div>
        </div>
        <form className="form gate-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
            />
            {passwordError && <p className="hint hint-error">{passwordError}</p>}
          </div>
          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={verifying}>
              {verifying ? 'Checking…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="page page-grid-single">
      <div className="page-header">
        <div className="page-title-group">
          <h2 className="page-title">Admin control panel</h2>
          <p className="page-subtitle">
            Add buses (Bus ID + Route name only), view all, and delete buses.
          </p>
        </div>
      </div>

      <div className="page-grid">
        <section className="stat-card">
          <div className="stat-label">Add a new bus</div>
          <form className="form" onSubmit={handleAddBus}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bus ID</label>
                <input
                  className="form-input"
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  placeholder="e.g. BUS-303"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Route name</label>
                <input
                  className="form-input"
                  type="text"
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                  placeholder="e.g. R3"
                />
              </div>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding…' : 'Add bus'}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="page-header" style={{ marginBottom: 8 }}>
            <div className="page-title-group">
              <h3 className="page-title">All buses</h3>
              <p className="page-subtitle">View and delete buses.</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bus ID</th>
                  <th>Route</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id}>
                    <td>{bus.id}</td>
                    <td>{bus.busNumber}</td>
                    <td>
                      <span className="pill">Route {bus.routeNumber}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteBus(bus.id, `${bus.busNumber} (${bus.routeNumber})`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {buses.length === 0 && (
                  <tr>
                    <td className="empty-state" colSpan="4">
                      No buses. Add one using the form on the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;

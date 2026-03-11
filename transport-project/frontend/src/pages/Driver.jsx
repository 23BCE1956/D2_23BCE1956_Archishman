import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000';
const SOCKET_URL = 'http://localhost:5000';

function Driver({ driverVerified, setDriverVerified }) {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

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
      const { data } = await axios.post(`${API_URL}/verify-driver`, { password });
      if (data.ok) {
        setDriverVerified(true);
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

  useEffect(() => {
    if (!driverVerified || !selectedBusId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    const options = { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 };
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsStatus('Sending location…');
        socket.emit('locationUpdate', {
          busId: Number(selectedBusId),
          latitude,
          longitude,
        });
        setGpsStatus('Location sent');
      },
      (err) => {
        setGpsStatus('GPS error: ' + (err.message || 'Unavailable'));
      },
      options
    );
    watchIdRef.current = watchId;

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      socket.disconnect();
      socketRef.current = null;
      setGpsStatus('');
    };
  }, [driverVerified, selectedBusId]);

  if (!driverVerified) {
    return (
      <div className="page page-grid-single">
        <div className="page-header">
          <div className="page-title-group">
            <h2 className="page-title">Driver access</h2>
            <p className="page-subtitle">Enter the driver password to continue.</p>
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
              placeholder="Driver password"
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
    <div className="page page-grid">
      <section>
        <div className="page-header">
          <div className="page-title-group">
            <h2 className="page-title">Driver console</h2>
            <p className="page-subtitle">
              Select your bus. Your location is sent automatically via GPS.
            </p>
          </div>
          {gpsStatus && (
            <div className="chip">
              <span className="chip-dot" />
              {gpsStatus}
            </div>
          )}
        </div>

        <div className="form">
          <div className="form-group">
            <label className="form-label">Your bus</label>
            <select
              className="form-select"
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
            >
              <option value="">Select assigned bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber} — Route {bus.routeNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="hint">
          After selecting a bus, this page will use your device GPS and send updates in real time.
          No manual input needed.
        </p>
      </section>

      <aside className="stat-card">
        <div className="stat-label">Driver status</div>
        <div className="stat-value">{buses.length}</div>
        <div className="stat-caption">
          buses in the system. Select your bus to start broadcasting your location.
        </div>
      </aside>
    </div>
  );
}

export default Driver;

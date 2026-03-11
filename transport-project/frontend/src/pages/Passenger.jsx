import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = 'http://localhost:5000';
const SOCKET_URL = 'http://localhost:5000';

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000;

function isOnline(lastUpdated) {
  if (!lastUpdated) return false;
  return Date.now() - lastUpdated < ONLINE_THRESHOLD_MS;
}

function LiveMarkers({ buses }) {
  const map = useMap();
  useEffect(() => {
    if (buses.length === 0) return;
    const valid = buses.filter((b) => b.latitude != null && b.longitude != null && (b.latitude !== 0 || b.longitude !== 0));
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((b) => [b.latitude, b.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [buses, map]);
  return null;
}

const busIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Passenger() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/buses`);
        if (mounted) setBuses(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    const socket = io(SOCKET_URL);
    socket.on('locationUpdate', (bus) => {
      if (!mounted) return;
      setBuses((prev) => {
        const next = prev.map((b) => (b.id === bus.id ? { ...b, ...bus } : b));
        if (!next.find((b) => b.id === bus.id)) next.push(bus);
        return next;
      });
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, []);

  const defaultCenter = useMemo(() => {
    const withPos = buses.filter((b) => b.latitude != null && b.longitude != null && (b.latitude !== 0 || b.longitude !== 0));
    if (withPos.length === 0) return [22.5726, 88.3639];
    const lat = withPos.reduce((s, b) => s + b.latitude, 0) / withPos.length;
    const lng = withPos.reduce((s, b) => s + b.longitude, 0) / withPos.length;
    return [lat, lng];
  }, [buses]);

  const markers = buses.filter((b) => b.latitude != null && b.longitude != null && (b.latitude !== 0 || b.longitude !== 0));

  return (
    <div className="page page-grid">
      <section>
        <div className="page-header">
          <div className="page-title-group">
            <h2 className="page-title">Live bus overview</h2>
            <p className="page-subtitle">Map and list update in real time. No refresh needed.</p>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={defaultCenter}
            zoom={11}
            style={{ height: '320px', width: '100%', borderRadius: '12px' }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LiveMarkers buses={buses} />
            {markers.map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.latitude, bus.longitude]}
                icon={busIcon}
              >
                <Popup>
                  {bus.busNumber} — Route {bus.routeNumber}
                  <br />
                  ETA: {bus.eta || '—'}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Route</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.busNumber}</td>
                  <td>
                    <span className="pill">Route {bus.routeNumber}</span>
                  </td>
                  <td>
                    <span className="pill pill-success">{bus.eta || '—'}</span>
                  </td>
                  <td>
                    {isOnline(bus.lastUpdated) ? (
                      <span className="pill pill-success">Online</span>
                    ) : (
                      <span className="pill pill-offline">Offline</span>
                    )}
                  </td>
                </tr>
              ))}
              {buses.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No buses. Add buses from the Admin page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="stat-card">
        <div className="stat-label">Live snapshot</div>
        <div className="stat-value">{buses.length}</div>
        <div className="stat-caption">
          buses. Online = location updated in the last 2 minutes.
        </div>
      </aside>
    </div>
  );
}

export default Passenger;

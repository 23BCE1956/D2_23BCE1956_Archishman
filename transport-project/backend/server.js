const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const PORT = 5000;

// Hardcoded passwords (beginner-friendly, no .env)
const DRIVER_PASSWORD = 'driver123';
const ADMIN_PASSWORD = 'admin123';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage: each bus has lastUpdated (timestamp in ms) for Online/Offline
let buses = [
  {
    id: 1,
    busNumber: 'BUS-101',
    routeNumber: 'R1',
    latitude: 22.5726,
    longitude: 88.3639,
    eta: '10 mins',
    lastUpdated: Date.now(),
  },
  {
    id: 2,
    busNumber: 'BUS-202',
    routeNumber: 'R2',
    latitude: 22.59,
    longitude: 88.4,
    eta: '15 mins',
    lastUpdated: Date.now(),
  },
];

let nextId = buses.length + 1;

// ----- REST API -----

app.get('/', (req, res) => {
  res.send('Real-Time Public Transport Tracking API is running');
});

app.get('/buses', (req, res) => {
  res.json(buses);
});

// Add bus: Bus ID + Route only (no lat/long from admin)
app.post('/buses', (req, res) => {
  const { busNumber, routeNumber } = req.body;

  if (!busNumber || !routeNumber) {
    return res.status(400).json({
      message: 'busNumber and routeNumber are required',
    });
  }

  const now = Date.now();
  const newBus = {
    id: nextId++,
    busNumber: String(busNumber).trim(),
    routeNumber: String(routeNumber).trim(),
    latitude: 0,
    longitude: 0,
    eta: '10 mins',
    lastUpdated: now,
  };

  buses.push(newBus);
  res.status(201).json(newBus);
});

// Password verification (no JWT, simple compare)
app.post('/verify-driver', (req, res) => {
  const { password } = req.body || {};
  if (password === DRIVER_PASSWORD) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, message: 'Invalid driver password' });
});

app.post('/verify-admin', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, message: 'Invalid admin password' });
});

app.delete('/buses/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = buses.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  const deletedBus = buses.splice(index, 1)[0];
  res.json(deletedBus);
});

// ----- HTTP server + Socket.io -----

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  socket.on('locationUpdate', (data) => {
    const { busId, latitude, longitude } = data;
    const bus = buses.find((b) => b.id === Number(busId));
    if (!bus) return;

    bus.latitude = Number(latitude);
    bus.longitude = Number(longitude);
    bus.lastUpdated = Date.now();

    io.emit('locationUpdate', bus);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

# System Architecture

The Real-Time Public Transport Tracking System follows a web-based, client–server architecture designed for live location tracking and real-time communication.

The Web Frontend is built using React.js and Tailwind CSS. It provides three interfaces: a Passenger Interface for viewing buses on a live map, a Driver Interface for sending real-time GPS coordinates, and an Admin Dashboard for managing routes, vehicles, and system data. Map rendering and route visualization are handled using Google Maps or Mapbox APIs.

The Backend Server is developed using Node.js and Express.js. It exposes a REST API layer for authentication, user management, CRUD operations, and route management. Real-time communication is handled through a WebSocket layer implemented with Socket.IO, enabling continuous GPS broadcasting and live location updates to connected clients.

An ETA Calculation module processes location data to estimate arrival times, detect delays, and generate analytics.

MongoDB is used as the primary database to store users, vehicles, routes, and location history. The backend performs read and write operations to maintain persistent system data.

This architecture ensures scalability, real-time performance, and efficient communication between drivers, passengers, and administrators.

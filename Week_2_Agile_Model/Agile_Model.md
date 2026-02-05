# Agile Development Model

The Real-Time Public Transport Tracking System is developed using the Agile methodology. Agile helps in building the project step by step, making it easier to understand, develop, and improve continuously.

The project is divided into small phases called sprints. Each sprint focuses on a specific part of the system and delivers a working feature.

## Sprint 1: Requirement Analysis and Planning
In this sprint, the project requirements are identified and clearly defined. The system architecture is designed, including the web frontend, backend server, database, and real-time communication using WebSockets. Tools and technologies such as React, Node.js, Express, MongoDB, and Socket.IO are finalized.

## Sprint 2: Frontend Development
In this sprint, the web frontend is developed using React.js and Tailwind CSS. Separate interfaces are created for passengers, drivers, and administrators. Map integration using Google Maps or Mapbox is implemented to display routes and live vehicle locations.

## Sprint 3: Backend and Database Development
This sprint focuses on building the backend using Node.js and Express.js. REST APIs are created for authentication, user management, route management, and CRUD operations. MongoDB is integrated to store users, vehicles, routes, and location history.

## Sprint 4: Real-Time Tracking and ETA Calculation
In this sprint, WebSocket communication using Socket.IO is implemented. Drivers send live GPS data, which is broadcast to passengers in real time. The ETA calculation module is developed to estimate arrival times and detect delays.

## Sprint 5: Testing and Deployment
The final sprint involves testing the complete system to ensure accuracy and performance. Bugs are fixed, and the application is optimized. The project is then prepared for deployment and final documentation.

Using the Agile model allows continuous improvement, easier debugging, and timely delivery of the project.

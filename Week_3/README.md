Class Diagram Description

The class diagram represents the structural design of the Real-Time Public Transport Tracking System. It shows the main entities involved in the system, their attributes, methods, and relationships with one another.

Driver

The Driver class contains information related to the bus driver.
Attributes include driverID, name, and licenseNumber.
The driver can perform two main actions: startTrip() and sendGPSLocation().
The driver is responsible for initiating the journey and continuously sending location updates to the tracking system.

Passenger

The Passenger class stores passenger-related details such as passengerID, name, and email.
Passengers can access two functions: viewLiveLocation() and viewETA().
This allows them to monitor the real-time position of a bus and check the estimated time of arrival.

Admin

The Admin class represents the system administrator.
It contains attributes like adminID, username, and password.
The admin can addBus(), removeBus(), and monitorVehicles().
This class manages system-level operations and ensures proper functioning of the transport system.

Bus

The Bus class represents a vehicle in the system.
It includes busID, routeNumber, and capacity.
The updateLocation() function allows the bus’s location data to be refreshed during a trip.

Location

The Location class stores geographical data.
It includes latitude, longitude, and timestamp.
This class represents the current position of a bus at a specific time.

TrackingSystem

The TrackingSystem class acts as the central component.
It contains the systemName attribute and includes methods such as receiveLocation(), calculateETA(), updateDatabase(), and broadcastToPassengers().
This class handles receiving GPS data, computing arrival times, updating stored records, and sending updates to users.

Database

The Database class manages data storage.
It includes a connectionString attribute and methods like storeLocation() and retrieveLocation().
It supports the tracking system by maintaining location and trip data.

Relationships

A driver operates a bus.
A bus is associated with one location at a time.
The tracking system communicates with drivers, passengers, admin, and the database.
Multiple passengers can access the tracking information of a bus.
The admin can manage multiple buses within the system.

The class diagram overall represents the static structure of the system and defines how different components are logically connected.




2. Use Case Diagram Description

The use case diagram illustrates how different users interact with the system. It identifies the actors and the actions they can perform.

Actors

There are three main actors in the system:
Passenger
Driver
Admin

Passenger Use Cases

Passengers can:
View Live Location
View ETA

This allows passengers to track buses in real time and estimate arrival time at their stop.

Driver Use Cases

Drivers can:
Start Trip
Send GPS Location

The driver initiates the journey and continuously shares GPS coordinates with the system while the trip is active.

Admin Use Cases

The admin can:
Add Bus
Remove Bus
Monitor Vehicles

The admin is responsible for maintaining the list of active buses and supervising the transport network.

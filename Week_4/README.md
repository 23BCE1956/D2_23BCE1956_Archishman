1. Activity Diagram Description

The activity diagram represents the overall workflow of the system from the moment a driver starts a trip until the passenger views the updated location. It shows the sequence of actions, decision points, and system responses.

The process begins when the driver starts a trip. Once the trip is initiated, the system proceeds to send GPS coordinates from the driver’s device.

After sending the coordinates, the system checks whether the GPS data is valid. This validation step ensures that incorrect or unavailable location data is not processed further.

If the GPS data is not valid, an error message is displayed. The driver must correct the issue before the system can continue sending location updates.

If the GPS data is valid, the backend receives the location data. The received data is then stored in the database for record keeping and future reference.

Once the location is successfully stored, the system calculates the Estimated Time of Arrival (ETA). This calculation is based on the current position of the vehicle and its route information.

After calculating the ETA, the system broadcasts the updated location information to passengers. The broadcast ensures that all users viewing the system receive the latest data.

Finally, the passenger views the live location on the application interface, marking the end of the activity flow.

The activity diagram focuses on the internal workflow and logical progression of actions within the system.


2. Sequence Diagram Description

The sequence diagram illustrates the interaction between different system components over time. It shows how messages are exchanged between the driver, frontend, backend, database, passenger, and map service.

The sequence begins when the driver sends GPS coordinates. These coordinates are first transmitted to the web frontend.

The web frontend forwards the GPS data to the backend server using a WebSocket connection. This ensures real-time communication between the client and server.

Once the backend server receives the data, it stores the location information in the database. In this diagram, MongoDB is used to save the location details.

After successfully storing the location, the backend confirms that the location has been saved.

The backend then broadcasts the updated location to connected passengers. This step ensures that users receive live updates without needing to manually refresh the application.

When the passenger receives the update, the application requests a map update from the Maps API. The Maps API processes the request and returns the updated map view.

Finally, the passenger sees the updated map with the latest bus location rendered on the screen.

The sequence diagram highlights real-time communication and data flow between different system components. It emphasizes how location data moves from the driver’s device to the passenger’s interface through multiple system layers.


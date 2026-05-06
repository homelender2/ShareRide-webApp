# ShareRide Web Application Design

## Overview
ShareRide is a ride-sharing platform designed to facilitate cost-splitting for booked rides (Uber, Ola, etc.). It connects "hosts" (users who have booked or intend to book a ride) with "passengers" (users traveling along a similar route) by matching pickup and destination locations within user-defined radii.

## Core Features
- **Post a Ride**: Users can list a ride by specifying pickup/destination (via Mapbox search or map pin), date/time, price, and available seats.
- **Find a Ride**: Users can search for rides by defining their own pickup/destination and acceptable "walking" radii for both ends.
- **Proximity Matching**: Backend uses PostGIS (`ST_DWithin`) to find rides where both the pickup and drop-off points are within the requested distance from the user's points.
- **Visual Mapping**: Interactive Mapbox integration to visualize search results and manually pick locations.
- **Responsive Sidebar**: A multi-view sidebar that toggles between search/entry forms and a detailed results list.

## Technical Stack
- **Frontend**: React (Vite), Mapbox GL JS, `@mapbox/search-js-react`.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL with **PostGIS** extension for geospatial queries.
- **Styling**: Modern dark-themed UI with custom CSS.

## Data Model (PostgreSQL)

### Users Table
| Column | Type | Description |
| :--- | :--- | :--- |
| id | SERIAL | Primary Key |
| name | VARCHAR | User's full name |
| email | VARCHAR | Unique email |
| username | VARCHAR | Unique username |
| password_hash| TEXT | Bcrypt hashed password |

### Rides Table
| Column | Type | Description |
| :--- | :--- | :--- |
| id | SERIAL | Primary Key |
| host_user_id | INTEGER | FK to Users |
| source_location| GEOGRAPHY(POINT)| Pickup point (PostGIS) |
| destination_location| GEOGRAPHY(POINT)| Drop-off point (PostGIS) |
| price | NUMERIC | Total/Split price |
| seats_available| INTEGER | Available capacity |
| date_time | TIMESTAMP | Departure time |

## API Endpoints

### Rides
- `POST /api/rides`: Create a new ride listing.
- `GET /api/rides/search`: Query parameters: `sLat, sLng, sRad, dLat, dLng, dRad`. Returns rides matching both source and destination proximity.

### Auth
- `POST /api/users/register`: User signup with password hashing.

## Future Enhancements
- **Clerk Integration**: Replace custom auth with Clerk for robust session management.
- **Join Logic**: Backend endpoint to decrement `seats_available` and link passengers to rides.
- **Chat**: Real-time communication between host and passengers.
- **Payment Integration**: Digital split-payment processing.

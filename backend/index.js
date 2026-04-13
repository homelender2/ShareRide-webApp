const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

app.use(cors());

// Middleware to parse JSON data sent from frontend
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ShareRideDB',
    password: '123',
    port: 5432
})


// POST Route
app.post('/api/rides', async(req, res) => {
    const { host_user_id, source_lat, source_lng, destination_lat, destination_lng, datetime, price, seats_available } = req.body;
    try {
        const query = `
            INSERT INTO rides (host_user_id, source_location, destination_location, date_time, price, seats_available)
            VALUES ($1,
                    ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography,
                    ST_SetSRID(ST_MakePoint($5, $4), 4326)::geography,
                    $6, $7, $8)
            RETURNING *;
        `;
        const values = [host_user_id, source_lat, source_lng, destination_lat, destination_lng, datetime, price, seats_available];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Ride created successfully!",
            ride: result.rows[0]
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while creating ride"});
    }
});

app.get('/api/rides/search', async (req, res) => {
    // 1. Get user location and radius from the URL parameter
    // example: api/rides/search?lat=40.7306&lng=73.0352&radius=5000
    const {lat, lng, radius} = req.query;

    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: "Please provide lat, lng and radius "});
    }

    try {
        const query = `
            SELECT
                id, host_user_id, price, seats_available, date_time,
                ST_AsGeoJSON(source_location)::json AS source,
                ST_AsGeoJSON(destination_location)::json AS destination,
                -- Calculate actual distance in meters for the users to see
                ST_Distance(source_location, ST_MakePoint($2, $1)::geography) AS distance_meters
            FROM rides
            WHERE ST_DWithin(
                source_location,
                ST_MakePoint($2, $1)::geography,
                $3
            )
            ORDER BY distance_meters ASC;
        `;
        
        const values = [lat, lng, radius];
        const result = await pool.query(query, values);

        res.json({
            results_count: result.rows.length,
            rides: result.rows
        });

    } catch(err) {
        console.error("Search Error: ", err);
        res.status(500).json({ error: "Database search failed" });
    }
});


app.post('/api/users/register', async(req, res) => {
    const { name, email, mobile_number, username, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const saltRounds = 10;

    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const values = [name, email, mobile_number, username, password_hash];
    
    try {
        const query = `
        INSERT INTO users (name, email, mobile_number, username, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        `;

        const result = await pool.query(query, values);
        res.status(201).json({
            message: "Registered successfully"
        });
    } catch (err) {
        if (err.code == '23505') {
            return res.status(400).json({ error: "Username or Email already exists" });
        }
        console.error(err.message);
        res.status(500).json({ error : "Server error while registering user" });
    }
});


// Simple Route to see if server is running
app.get('/', (req, res) => {
    res.send('ShareRide server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
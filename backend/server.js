const express = require('express');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API ROUTE CONNECTIONS ---
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const authRoutes = require('./routes/authRoutes'); // NEW: Added Auth route file
app.use('/api/auth', authRoutes);                  // NEW: Connected Auth to the /api/auth URL
// -----------------------------

// Function to start the database and server
async function startServer() {
    try {
        // 1. Start the In-Memory Database
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // 2. Connect Mongoose to it
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to In-Memory MongoDB successfully!");

        // 3. Create a simple route to test it
        app.get('/', (req, res) => {
            res.send("Backend server is running!");
        });

        // 4. Start listening for requests
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error starting server:", error);
    }
}

startServer();
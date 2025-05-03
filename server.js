const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Validate Environment Variables
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the .env file.');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const skillRoutes = require('./routes/skills');
const noteRoutes = require('./routes/notes');
const progressRoutes = require('./routes/progress');
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/skills', skillRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');

        // Start Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process if the database connection fails
    });

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
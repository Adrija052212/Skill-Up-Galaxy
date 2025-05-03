require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Validate Environment Variables
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the .env file.');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Routes
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const noteRoutes = require('./routes/notes');
const progressRoutes = require('./routes/progress');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/progress', progressRoutes);

// Default Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Skill-Up Galaxy API!',
        endpoints: {
            auth: '/api/v1/auth',
            skills: '/api/v1/skills',
            notes: '/api/v1/notes',
            progress: '/api/v1/progress',
        },
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
console.log(`Server is starting on port ${PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
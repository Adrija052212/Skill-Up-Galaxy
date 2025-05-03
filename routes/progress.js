const express = require('express');
const Progress = require('../models/Progress');

const router = express.Router();

// Get progress for a user
router.get('/', async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user.id });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching progress' });
    }
});

module.exports = router;
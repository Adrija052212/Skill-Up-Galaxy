const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().populate('user', 'name');
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

module.exports = router;
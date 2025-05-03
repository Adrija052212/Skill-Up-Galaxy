const express = require('express');
const Skill = require('../models/Skill');

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().populate('user', 'name avatar rating');
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching skills' });
    }
});

module.exports = router;
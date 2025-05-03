const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress data
router.get('/', async (req, res) => {
    try {
        const progress = await Progress.findOne();
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update progress data
router.put('/', async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(progress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

async function fetchSkills() {
    const response = await fetch('http://localhost:5000/api/skills');
    const skills = await response.json();
    renderSkills(skills);
}

function renderSkills(skills) {
    skillsGrid.innerHTML = '';
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <h3>${skill.name}</h3>
            <span class="category">${skill.category}</span>
            <p class="description">${skill.description}</p>
            <div class="user">
                <img src="${skill.user.avatar}" alt="${skill.user.name}">
                <div class="user-info">
                    <span class="name">${skill.user.name}</span>
                    <span class="rating">${skill.user.rating} ★</span>
                </div>
            </div>
            <button class="btn request-btn">Request Help</button>
        `;
        skillsGrid.appendChild(skillCard);
    });
}

module.exports = router;
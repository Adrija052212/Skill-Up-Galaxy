const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    user: {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        rating: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Skill', SkillSchema);
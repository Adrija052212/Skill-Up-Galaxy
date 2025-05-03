const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    subjects: [
        {
            name: { type: String, required: true },
            percentage: { type: Number, required: true }
        }
    ],
    goals: [{ type: String }]
});

module.exports = mongoose.model('Progress', ProgressSchema);
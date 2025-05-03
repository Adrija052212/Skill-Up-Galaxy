const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjects: [
        {
            name: { type: String, required: true },
            percentage: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Progress', ProgressSchema);
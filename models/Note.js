const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    hasPDF: { type: Boolean, default: false },
    fileName: { type: String, default: null }
});

module.exports = mongoose.model('Note', NoteSchema);
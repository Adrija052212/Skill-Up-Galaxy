const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://randomuser.me/api/portraits/men/1.jpg' },
    rating: { type: Number, default: 5.0 },
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: 30,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
});

exports.User = mongoose.model('User', userSchema);

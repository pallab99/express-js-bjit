const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
    email: String,
    timestamp: {
        type: [Date],
    },
    blockUserFromLogin: {
        type: Date,
        required: false,
    },
});

const LoginAttemptModel = mongoose.model('LoginAttempt', loginAttemptSchema);

module.exports = LoginAttemptModel;

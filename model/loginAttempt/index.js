const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
    email: String,
    timestamp: {
        type: [Date],
    },
});

const LoginAttemptModel = mongoose.model('LoginAttempt', loginAttemptSchema);

module.exports = LoginAttemptModel;

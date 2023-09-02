const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    uuid: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required'],
        maxLength: 30,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: [8, 'Password must be minimum 8 characters'],
        max: [15, 'Password can not be greater than 15 characters'],
    },
    refreshToken: {
        type: [String],
        required: false,
    },
    addedAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

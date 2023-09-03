const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema(
    {
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
            lowercase: true,
            validate: {
                validator: function (value) {
                    return validator.isEmail(value);
                },
                message: 'Invalid email format',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            min: [8, 'Password must be minimum 8 characters'],
            max: [15, 'Password can not be greater than 15 characters'],
        },
        isValidSession: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;

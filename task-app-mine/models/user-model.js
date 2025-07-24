const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter your email address']
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate: {
            validator: function (val) {
                val.includes('password');
            },
            message: 'Password should not contain the word \'Password\''
        }
    },
    age: {
        type: Number,
        default: 0,
        min: [1, 'Age should be a valid number']
    }
});

const User = mongoose.Model('User', userSchema);

module.exports = User;
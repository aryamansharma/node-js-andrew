const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.statics.findByCredentials = async function (email, password) {
    const User = this;
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Username or password is wrong');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error('Username or password is wrong');
    }

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const jwt = jsonWebToken.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    user.tokens.push({ token: jwt });

    return jwt
}

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
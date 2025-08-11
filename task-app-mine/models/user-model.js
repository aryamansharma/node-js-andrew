const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const Task = require('../models/task-model');

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
}, {
    timestamps: true
});

////////// Virtual properties ///////////

// this virtual property can be used to fetch all the tasks created by a user

// this virtual property 'tasks' will return an array of objects because the retlationsjip which we have defined
// is a one-to-many relationship, basically it will return all the tasks where localField from the 'User' model
// and foreignField from the 'Task' model will be matching. 

userSchema.virtual('tasks', {
    ref: 'Task',
    // this is the field in the User model will be used to match documents in the task model.
    localField: '_id',
    // this is the field in the Task model that will be matched against the 'localField'
    foreignField: 'owner'
});

////////// STATIC METHODS ///////////

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

////////// INSTANCE METHODS ///////////

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const jwt = jsonWebToken.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    user.tokens.push({ token: jwt });

    return jwt
}

userSchema.methods.getPublicProfile = function () {
    const user = this;

    // this 'toObject' method from mongoose will convert a Bson object a js object so that we can perform 
    // basic operations such as delete a property, etc.
    // if we dont use this method, the delete operation below for deleting password and tokens array will not work
    const userObj = user.toObject();

    delete userObj.tokens;
    delete userObj.password;

    return userObj;
}


////////// DOCUMENT MIDDLEWARES ///////////

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }

    next();
});


// the second parameter(object) in below middleware is used to specify that the below middleware should 
// run for document level operations, not for query level operations

// this middleare is for deleting all the tasks of the user who is bqing deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
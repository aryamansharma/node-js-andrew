const User = require('../models/user-model');

// method for hiding password and tokens array,
// we can call this method just before sending user as a response.
const hidePasswrdAndTkns = (user) => {
    user.password = undefined;
    user.tokens = undefined;
}

exports.signUpUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const email = req.body?.email;
        const password = req.body?.password;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

exports.logout = async (req, res) => {
    try {
        const user = req.user;
        const jwt = req.token;
        const tokens = user.tokens.filter((tokenObj) => {
            if (tokenObj.token !== jwt) return tokenObj;
        });
        user.tokens = tokens;
        await user.save();
        res.status(200).json({
            data: user,
            message: 'user logout'
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json({
            data: req.user,
            message: 'user logout from all devices'
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

exports.getProfile = async (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json({
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const reqBody = req.body;
        const user = await User.findByIdAndUpdate(id, reqBody, {
            runValidators: true,
            new: true
        });
        res.status(200).json({
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}
const User = require('../models/user-model');

exports.signUpUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        await user.save();
        user.password = undefined;
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
        user.password = undefined;
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

exports.getProfile = async (req, res) => {
    const user = req.user;
    user.password = undefined;
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
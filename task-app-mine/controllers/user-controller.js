const User = require('../models/user-model');

// method for hiding password and tokens array,
// we can call this method just before sending user as a response.
// const hidePasswrdAndTkns = (user) => {
//     user.password = undefined;
//     user.tokens = undefined;
// }

exports.signUpUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).json({ user: user.getPublicProfile(), token });
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
        res.status(200).json({ user: user.getPublicProfile(), token });
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
            user: user.getPublicProfile(),
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
            user: req.user.getPublicProfile(),
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
        user: req.user.getPublicProfile()
    });
}

exports.updateUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const updates = Object.keys(reqBody);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) return res.status(400).json({
            message: 'Invalid operation'
        });

        // this is also a way to update a document, but here we are not going to use it as
        // our model is using doc middleware to hash password which only works with 'save' and 'create'
        // so if a user updates his password but will not be hashed.

        // await req.user.updateOne(reqBody);

        updates.forEach((update) => {
            req.user[update] = reqBody[update];
        });

        // if we are using 'save' method here we can also send the updated document to the user,
        // no need to do some useless work around.
        await req.user.save();
        res.status(200).json({
            user: req.user.getPublicProfile()
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // just like 'save' method on a document we have a 'deleteOne' method as well to remove the document.
        await req.user.deleteOne();
        res.status(200).json({
            user: req.user.getPublicProfile()
        });
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}
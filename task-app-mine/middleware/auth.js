const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user-model');
const moment = require('moment');

const auth = async (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if (!token) throw new Error('Please Authenticate');

        token = token.replace('Bearer ', '');

        const decoded = jsonWebToken.verify(token, process.env.SECRET);

        const jwtExpirydate = moment(decoded.exp * 1000);

        if (moment().isAfter(jwtExpirydate)) throw new Error('Jwt expired');

        // this line is checking for a user which has the 'id' from the payload and has the token from headers in the tokens array as the value 
        // of one of the token property of the array of objects.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) throw new Error('No user found');

        req.user = user;
        // req.token = token
        next();
    } catch (err) {
        res.status(401).json({
            message: err.message
        });
    }
}

module.exports = auth;
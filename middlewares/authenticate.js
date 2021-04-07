const { HTTP }      = require('../lib/constants');
const { decodeJWT } = require('../lib/decodeJWT');

module.exports = (req, res, next) => {
    let errorMsg;
    let errors = {};

    let token;
    if(!req.headers.authorization) {
        return res.status(HTTP.UNAUTHORIZED).json({"message" : 'Not authorized'});
    }

    token = req.headers.authorization;
    if(!token) {
        return res.status(HTTP.UNAUTHORIZED).json({ "message": "invalid token"});
    }

    token = token.split(' ')[1];
    const decoded = decodeJWT(token);
    if(decoded == null) {
        errorMsg = "Authorization failed";
        errors.jwt = [errorMsg];
        return res.status(HTTP.UNAUTHORIZED).json({ errors });
    }
    req.userData = decoded;
    next();
};
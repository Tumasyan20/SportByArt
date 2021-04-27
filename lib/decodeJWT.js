const jwt       = require('jsonwebtoken');
const config    = require('../config');

const decodeJWT = (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_KEY);
        return decoded;
    }
    catch(exception) {
        return null
    }
}

module.exports = decodeJWT;
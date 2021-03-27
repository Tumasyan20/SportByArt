const User                  = require("../models/Users");
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');

const registerUser = async (req, res) => {
    
    try {
        const {
            username,
            email,
            password
        } = req.body;
    
        const user = await new User({
            username,
            email,
            password
        });
    
        user.save();
    
        return res.status(HTTP.CREATED).json({"message" : "User created successfuly"});
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

const getUsers = async (req, res) => {

    try {
        await User.find({}).then((result) => {
            if(result.length == 0) {
                throw new HTTPException("Can't find any user", HTTP.NOT_FOUND)
            }
            return res.status(HTTP.OK).json(result)
        });

    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

module.exports = {
    registerUser,
    getUsers
}
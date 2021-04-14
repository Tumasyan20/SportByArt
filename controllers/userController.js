const User                  = require("../models/Users");
const bcrypt                = require("bcrypt");
const jwt                   = require("jsonwebtoken");
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const config                = require('../config');


//? controller for register new users
const registerUser = async (req, res) => {
    
    try {
        const {
            username,
            email,
            password
        } = req.body;

        if(!username) {
            throw new HTTPException("Missed username", HTTP.BAD_REQUEST);
        }

        if(username.length < 5) {
            throw new HTTPException("Too short username", HTTP.FORBIDDEN);
        }

        if(!email) {
            throw new HTTPException("Missed email", HTTP.BAD_REQUEST);
        }

        //todo email validation

        if(!password) {
            throw new HTTPException("Missed password", HTTP.BAD_REQUEST);
        }

        if(password.length < 8) {
            throw new HTTPException("Too short password", HTTP.FORBIDDEN)
        }
        
        await User.findOne({username}).then((result) => {
            if(result) {
                throw new HTTPException("User by that username already exist.", HTTP.CONFLICT);
            }
        });

        let hash = await bcrypt.hash(password, 10);

        const user = await new User({
            username,
            email,
            password: hash
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

//? Controller for user authentication
const userLogin = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;
    
        if(!username || !password) {
            throw new HTTPException("Missed username or password", HTTP.BAD_REQUEST);
        }

        const user = await User.findOne({username}).catch(error => {
            if(err) {
                throw new HTTPException("Cant find any user by that username", HTTP.FORBIDDEN)
            }
        });
        bcrypt.compare(password, user.password, async (err, result) => {
            if(err) {
                console.log(err)
                return res.status(HTTP.INTERNAL_SERVER_ERROR).json({"message" : "Something went wrong!"});
            }

            if(result) {
                let userData = {
                    username: user.username,
                    id: user._id,
                    email: user.email,
                    last_login: user.last_login
                };

                user.last_login = Date.now();
                await user.save();

                const token = jwt.sign(
                    {
                        userID: user._id
                    },
                    config.JWT_KEY,
                    {
                        expiresIn: '1d'
                    }
                );

                return res.status(HTTP.OK).json({ dataValues: {token, userData}});
            }
            return res.status(HTTP.FORBIDDEN).json({ "message" : "Wrong username or password"})
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


//? Controller for get all users
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
    userLogin,
    getUsers
}
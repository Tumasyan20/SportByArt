//? Connecting node moduls
const bcrypt                = require("bcrypt");
const jwt                   = require("jsonwebtoken");

//? Connecting db model(s)
const User                  = require("../models/Users");

//? Connecting custom models
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');
const config                = require('../config');
const emailValidate         = require('../lib/emailValidate');


//? controller for register new users
const registerUser = async (req, res) => {
    try {

        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

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

        if(emailValidate(email) == false) {
            throw new HTTPException("Wrong email", HTTP.BAD_REQUEST);
        }

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

        if(!checkRights(user.id, 5)) {
            throw new HTTPException("No admin rights", HTTP.FORBIDDEN);
        }

        if(!user) {
            throw new HTTPException("Username or password is incorrect", HTTP.FORBIDDEN);
        }

        if(user.root != 5) {
            throw new HTTPException("No admin rights!", HTTP.BAD_REQUEST)
        }

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
            console.log(exception)
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for get all users
const getUsers = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        await User.find({}).then((result) => {
            if(result == null || result.length == 0) {
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

//? Controller for update category
const updateUser = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            user_id,
            username,
            email,
            passowrd
        } = req.body;

        if(!user_id) throw new HTTPException("User id does not exist", HTTP.BAD_REQUEST);

        const user = await User.findById({'_id' : user_id})
        .catch(err => {if(err) throw new HTTPException("Wrong id", HTTP.BAD_REQUEST)})
        .then(result => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.NOT_FOUND);
            }

            return result;
        });

        if(username) user.username = username;

        if(email) user.email = email;

        if(passowrd) {
            if(password.length < 8) {
                throw new HTTPException("Too short password", HTTP.FORBIDDEN)
            }

            let hash = await bcrypt.hash(password, 10);

            user.password = hash;
        }

        user.save();

        return res.status(HTTP.OK).json({'message' : "Success!"});
    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for delete user
const deleteUser = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const user = await User.findById({'_id' : req.params.id})
        .catch(exception => {
            if(exception) {
                throw new HTTPException("Wrong id", HTTP.BAD_REQUEST);
            }
        })
        .then((result) => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result!", HTTP.NOT_FOUND);
            }

            return result;
        });
        

        await user.deleteOne();
        return res.status(HTTP.OK).json({'message' : 'Success'})

    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}


module.exports = {
    registerUser,
    userLogin,
    getUsers,
    updateUser,
    deleteUser
}
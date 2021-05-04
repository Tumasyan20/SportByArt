const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware

const userController = require('../../controllers/userController');     //? Connect user controller

router.post('/register', Authenticate, userController.registerUser);      //? route for user register
router.post('/login', userController.userLogin);                          //? route for user login
router.get('/list', Authenticate, userController.getUsers);               //? route for get user list
router.put('/update', Authenticate, userController.updateUser);           //? route for update user
router.delete('/delete/:id', Authenticate, userController.deleteUser);    //? route for delete user

module.exports = router;
const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const userController = require('../../controllers/userController');     //? Connect user controller

router.post('/register', userController.registerUser);      //? route for user register
router.post('/login', userController.userLogin);            //? route for user login
router.get('/list', userController.getUsers);               //? route for get user list

module.exports = router;
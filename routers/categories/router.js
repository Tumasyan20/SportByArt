const express   = require('express');
const router    = express.Router();

const categoryController = require('../../controllers/categoryController'); //? Connect category controller

const Authenticate       = require('../../middlewares/authenticate');       //? Connecting authenticate middleware


router.get('/list/:type', categoryController.getCategories);                //? Route for get all categories
router.get('/:categoryId', Authenticate, categoryController.getCategory);   //? Route for get category article list, by sended category id
router.post('/add', Authenticate, categoryController.addCategory);          //? Route for add new category

module.exports = router;
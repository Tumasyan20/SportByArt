const express   = require('express');
const router    = express.Router();

const categoryController = require('../../controllers/categoryController');     //? Connect category controller

router.get('/list', categoryController.getCategories);      //? Route for get all categories
router.get('/:categoryId', categoryController.getCategory); //? Route for get category article list, by sended category id
router.post('/add', categoryController.addCategory);        //? Route for add new category

module.exports = router;
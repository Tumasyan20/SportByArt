const express   = require('express');
const router    = express.Router();

const categoryController = require('../../controllers/categoryController'); //? Connect category controller

const Authenticate       = require('../../middlewares/authenticate');       //? Connecting authenticate middleware


router.get('/list/:type', categoryController.getCategories);                    //? Route for get all categories
router.get('/:categoryId/:page', categoryController.getCategory);               //? Route for get category article list, by category id
router.get('/:id', categoryController.getCategoryInfo);                    //? Route for get category info
router.post('/add', Authenticate, categoryController.addCategory);              //? Route for add new category
router.put('/update', Authenticate, categoryController.updateCategory);         //? Route for update category
router.delete('/delete/:id', Authenticate, categoryController.deleteCategory);  //? Route for delete category

module.exports = router;
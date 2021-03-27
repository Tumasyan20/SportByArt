const express   = require('express');
const router    = express.Router();

const subCategoryController = require("../../controllers/subCategoryController");

router.get('/list', subCategoryController.getSubCategories);                //? Route for get all sub ctagories
router.get('/list/:categoryId', subCategoryController.subCategoriesById);   //? Route for get category subcategories
router.post('/add', subCategoryController.addSubCategory);                  //? route for add new sub category

module.exports = router;
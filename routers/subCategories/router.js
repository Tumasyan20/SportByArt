const express   = require('express');
const router    = express.Router();

const subCategoryController = require("../../controllers/subCategoryController");

const Authenticate       = require('../../middlewares/authenticate');       //? Connecting authenticate middleware

router.get('/list', subCategoryController.getSubCategories);                            //? Route for get all sub ctagories
router.get('/list/:categoryId', subCategoryController.subCategoriesById);               //? Route for get category subcategories
router.post('/add', Authenticate, subCategoryController.addSubCategory);                //? route for add new sub category
router.put('/update', Authenticate, subCategoryController.updateSubCategory);           //? Route for update category
router.delete('/delete/:id', Authenticate, subCategoryController.deleteSubCategory);    //? Route for delete sub category

module.exports = router;
const express   = require('express');
const router    = express.Router();

const subCategoryController = require("../../controllers/subCategoryController");

const Authenticate       = require('../../middlewares/authenticate');       //? Connecting authenticate middleware

router.get('/get/:id', subCategoryController.getSubCategory);                           //? Route for get sub category info by id
router.get('/list', subCategoryController.getSubCategories);                            //? Route for get all sub ctagories
router.get('/list/:categoryId', subCategoryController.subCategoriesById);               //? Route for get category subcategories
router.get('/list/article/:id', subCategoryController.getArticlesBySubCategory);        //? Route for get articles by sub category]
router.get('/:id', subCategoryController.getSubCategoryInfo);                           //? Controller for get sub category info
router.post('/add', Authenticate, subCategoryController.addSubCategory);                //? route for add new sub category
router.put('/update', Authenticate, subCategoryController.updateSubCategory);           //? Route for update category
router.delete('/delete/:id', Authenticate, subCategoryController.deleteSubCategory);    //? Route for delete sub category

module.exports = router;
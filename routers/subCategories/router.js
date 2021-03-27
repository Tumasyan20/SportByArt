const express   = require('express');
const router    = express.Router();

const subCategoryController = require("../../controllers/subCategoryController");

router.get('/list', subCategoryController.getSubCategories);        //? Route for get all sub ctagories
router.post('/add', subCategoryController.addSubCategory);

module.exports = router;
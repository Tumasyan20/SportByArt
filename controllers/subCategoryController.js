const SubCategory           = require("../models/SubCategories");
const Category              = require('../models/Categories');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for add new sub category
const addSubCategory = async (req, res) => {
    try {
        const {
            title,
            category
        } = req.body;
    
        if(!title) {
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!category) {
            throw new HTTPException("Category does not exist", HTTP.BAD_REQUEST);
        }

        await Category.findById({"_id" : category}).catch(error => {
            throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
        });

        const subCategories = new SubCategory({
            title,
            category
        });
    
        await subCategories.save();
    
        return res.status(HTTP.CREATED).json({"message" : "Sub category created successfuly!"})
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}


//? Controller for get all sub categories list
const getSubCategories = async (req, res) => {
    
    try {
        await SubCategory.find({}).then((result) => {
            if(!result) {
                throw new HTTPException("There are no sub category", HTTP.NOT_FOUND);
            }
            return res.status(HTTP.OK).json(result);
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


//? Controller for get sub category by category id
const subCategoriesById = async (req, res) => {
    try {
        const {categoryId} = req.params;


        if(!categoryId) {
            throw new HTTPException("Category id does not exist", HTTP.BAD_REQUEST);
        }

        await Category.findById({"_id" : categoryId}).catch( error => {
            throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
        });

        await SubCategory.find({"category" : categoryId}).then((result) => {
            if(!result) {
                throw new HTTPException("There is no sub category", HTTP.NOT_FOUND);
            }
            return res.status(HTTP.OK).json(result);
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

module.exports = {
    addSubCategory,
    getSubCategories,
    subCategoriesById
}
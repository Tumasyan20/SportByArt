//? Connecting db models
const SubCategory           = require("../models/SubCategories");
const Category              = require('../models/Categories');
const Article               = require('../models/Articles');

//? Connecting custom moduls
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');        //? function for check user rights


//? Controller for add new sub category
const addSubCategory = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights!", HTTP.FORBIDDEN);
        }

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

//? controller for get articles by sub category
const getArticlesBySubCategory = async (req, res) => {
    try {
        await Article.find({"subCategory_id" : req.params.id}).then((result) => {
            if(!result) {
                throw new HTTPException("No result!", HTTP.NOT_FOUND);
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

//? Controller for update category
const updateSubCategory = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            subCategory_id,
            title,
        } = req.body;

        const subCategory = await SubCategory.findById({'_id' : subCategory_id})
        .catch(err => {if(err) throw new HTTPException("Wrong id", HTTP.BAD_REQUEST)})
        .then(result => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.NOT_FOUND);
            }

            return result;
        });

        if(title) subCategory.title = title;

        subCategory.save();

        return res.status(HTTP.OK).json({'message' : "Success!"});
    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for delete sub category
const deleteSubCategory = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const subCategory = await SubCategory.findById({'_id' : req.params.id})
        .catch(exception => {
            if(exception) {
                throw new HTTPException("Wrong id", HTTP.BAD_REQUEST);
            }
        })
        .then((result) => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result!", HTTP.NOT_FOUND);
            }

            return result;
        });
        

        await subCategory.deleteOne();
        return res.status(HTTP.OK).json({'message' : 'Success'})

    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

module.exports = {
    addSubCategory,
    getSubCategories,
    getArticlesBySubCategory,
    subCategoriesById,
    updateSubCategory,
    deleteSubCategory
}
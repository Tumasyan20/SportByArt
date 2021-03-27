const Category  = require('../models/Categories');
const Article   = require('../models/Articles');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for add new categories
const addCategory =  async (req, res) => {
    try {
        const { title } = req.body;

        if(!title) {
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
        }

        const category = new Category({title});

        await category.save()
        return res.status(HTTP.OK).json({"message":"Category was created successfuly!"});
    }
    catch(exception) {
        console.log(exception);
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for get all category list
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).then(result => {
            if(!result) {
                throw new HTTPException("There is no category", HTTP.NOT_FOUND);
            }
            return res.status(HTTP.OK).json(categories);
        });

    }
    catch (exception) {
        console.log(exception);
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for all article required category
const getCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;
        
        if(!categoryId) {
            throw new HTTPException("Category does not exist", HTTP.NOT_FOUND);
        }

        await Category.findById({"_id" : categoryId}).catch(error=> {
            throw new HTTPException("Category by that id does not exist!", HTTP.NOT_FOUND)
        });

        await Article.find({"category" : categoryId}).then(result => {
            if(!result) {
                throw new HTTPException("There is no article", HTTP.NOT_FOUND)
            }
            return res.status(HTTP.OK).json(result);
        });
    }
    catch(exception) {
        console.log(exception);
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

module.exports = {
    addCategory,
    getCategories,
    getCategory
}
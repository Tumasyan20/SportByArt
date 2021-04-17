const Category  = require('../models/Categories');
const Article   = require('../models/Articles');
const User      = require('../models/Users');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for add new categories
const addCategory =  async (req, res) => {
    try {

        await User.findById({"_id" : req.userData.userID}).catch(error => {
            if(error) {
                throw new HTTPException("CATEGORY: Authorization error", HTTP.BAD_REQUEST);
            }
        })
        .then((result) =>{
            if(result.length == 0) {
                throw new HTTPException("CATEGORY: Authorization error", HTTP.BAD_REQUEST);
            }

            if(result.root != 5) {
                throw new HTTPException("CATEGORY: No admin rights.", HTTP.CONFLICT);
            }
        });

        const { title, show_in_nav} = req.body;

        if(!title) {
            throw new HTTPException("CATEGORY: Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!show_in_nav) {
            show_in_nav = false;
        }

        const category = new Category({title, show_in_nav, show_in_another});

        await category.save()
        return res.status(HTTP.OK).json({"message":"Category was created successfuly!"});
    }
    catch(exception) {
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
        if(!req.params.type) {
            throw new HTTPException("CATEGORY: Request parametr does not exist", HTTP.BAD_REQUEST);
        }

        const type = req.params.type;

        if(type == "navbar") {
            await Category.find({show_in_nav: true}).then(result => {
                if(result.length == 0) {
                    throw new HTTPException("CATEGORY: No results", HTTP.NOT_FOUND);
                }
                return res.status(HTTP.OK).json(result);
            });
        }

        if(type == "another") {
            await Category.find({show_in_nav: false}).then(result => {
                if(result.length == 0) {
                    throw new HTTPException("CATEGORY: No results", HTTP.NOT_FOUND);
                }
                return res.status(HTTP.OK).json(result);
            });
        }

        if(type == "all") {
            await Category.find({}).then(result => {
                if(result.length == 0) {
                    throw new HTTPException("CATEGORY: No results", HTTP.NOT_FOUND);
                }
                return res.status(HTTP.OK).json(result);
            });
        }

    }
    catch (exception) {
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
            throw new HTTPException("CATEGORY: Category does not exist", HTTP.NOT_FOUND);
        }

        await Category.findById({"_id" : categoryId}).catch(error=> {
            throw new HTTPException("CATEGORY: Wrong category id", HTTP.NOT_FOUND)
        });

        await Article.find({"category_id" : categoryId}, 
            "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
        ).then(result => {
            if(result.length == 0) {
                throw new HTTPException("CATEGORY: No results!", HTTP.NOT_FOUND)
            }
            return res.status(HTTP.OK).json(result);
        });
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            console.log(exception);
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
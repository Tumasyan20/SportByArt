//? Connecting db models
const Category  = require('../models/Categories');
const Article   = require('../models/Articles');

const { HTTP }              = require('../lib/constants');          //? exception status codes for response
const { HTTPException }     = require('../lib/HTTPexception');      //? custom js exception 
const checkRights           = require('../lib/checkRights');        //? function for check user rights


//? Controller for add new categories
const addCategory =  async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("CATEGORY: No admin rights!", HTTP.FORBIDDEN);
        }

        const { title, show_in_nav} = req.body;

        if(!title) {
            throw new HTTPException("CATEGORY: Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!show_in_nav) {
            show_in_nav = false;
        }

        const category = new Category({title, show_in_nav});

        await category.save()
        return res.status(HTTP.OK).json({"message":"Category was created successfuly!", category});
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
        let {categoryId, page} = req.params;
        
        if(!categoryId) {
            throw new HTTPException("CATEGORY: Category does not exist", HTTP.NOT_FOUND);
        }

        await Category.findById({"_id" : categoryId}).catch(error=> {
            throw new HTTPException("CATEGORY: Wrong category id", HTTP.NOT_FOUND)
        });

        if(page == 'all') {
            await Article.find({"category_id" : categoryId}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            ).then(result => {
                if(result.length == 0) {
                    throw new HTTPException("CATEGORY: No results!", HTTP.NOT_FOUND)
                }
                return res.status(HTTP.OK).json(result);
            });
        }
        else {
            page = parseInt(page);
            const limit = 10;

            await Article.find({"category_id" : categoryId}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            )
            .skip((page * limit) - limit).limit(limit)
            .sort('-publication').then(result => {
                if(result.length == 0) {
                    throw new HTTPException("CATEGORY: No results!", HTTP.NOT_FOUND)
                }
                return res.status(HTTP.OK).json(result);
            });
        }

        
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
    addCategory,
    getCategories,
    getCategory
}
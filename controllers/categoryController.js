//? Connecting db models
const Category  = require('../models/Categories');
const Article   = require('../models/Articles');


//? Connecting custom models
const { HTTP }              = require('../lib/constants');          //? exception status codes for response
const { HTTPException }     = require('../lib/HTTPexception');      //? custom js exception 
const checkRights           = require('../lib/checkRights');        //? function for check user rights


//? Controller for add new categories
const addCategory =  async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights!", HTTP.FORBIDDEN);
        }

        let { title, show_in_nav} = req.body;

        if(!title) {
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
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
            throw new HTTPException("Request parametr does not exist", HTTP.BAD_REQUEST);
        }

        const type = req.params.type;

        if(type == "navbar") {
            await Category.find({show_in_nav: true}).then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results", HTTP.NOT_FOUND);
                }
                return res.status(HTTP.OK).json(result);
            });
        }

        if(type == "another") {
            await Category.find({show_in_nav: false}).then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results", HTTP.NOT_FOUND);
                }
                return res.status(HTTP.OK).json(result);
            });
        }

        if(type == "all") {
            await Category.find({}).then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results", HTTP.NOT_FOUND);
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
            throw new HTTPException("Category does not exist", HTTP.NOT_FOUND);
        }

        await Category.findById({"_id" : categoryId}).catch(error=> {
            throw new HTTPException("Wrong category id", HTTP.NOT_FOUND)
        });

        if(page == 'all') {
            await Article.find({"category_id" : categoryId}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            ).then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results!", HTTP.NOT_FOUND)
                }
                return res.status(HTTP.OK).json(result);
            });
        }
        else {
            page = parseInt(page);
            const limit = 10;

            const articles = await Article.find({"category_id" : categoryId}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            )
            .skip((page * limit) - limit).limit(limit)
            .sort('-publication').then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results!", HTTP.NOT_FOUND)
                }
                return result;
            });

            const count = await Article.countDocuments();
            const pageCount = Math.ceil(count/limit);
            return res.status(HTTP.OK).json({'pageCount' : pageCount, articles});
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

//? Controller for get category info
const getCategoryInfo = async (req, res) => {
    try {
        await Category.findById({"_id" : req.params.id}).catch(error => {
            throw new HTTPException("Wrong id", HTTP.BAD_REQUEST);
        })
        .then((result) => {
            if(result == null || result.length == 0) {
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

//? Controller for update category
const updateCategory = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            category_id,
            title,
            show_in_nav
        } = req.body;

        const category = await Category.findById({'_id' : category_id})
        .catch(err => {if(err) throw new HTTPException("Wrong id", HTTP.BAD_REQUEST)})
        .then(result => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.NOT_FOUND);
            }

            return result;
        });

        if(title) category.title = title;

        if(show_in_nav) category.show_in_nav = show_in_nav;

        category.save();

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

//? Controller for delete category
const deleteCategory = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const category = await Category.findById({'_id' : req.params.id})
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
        

        await category.deleteOne();
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
    addCategory,
    getCategories,
    getCategory,
    getCategoryInfo,
    updateCategory,
    deleteCategory
}
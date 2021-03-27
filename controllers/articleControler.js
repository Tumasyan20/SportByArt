const Article               = require('../models/Articles');
const User                  = require('../models/Users');
const Category              = require('../models/Categories');
const SubCategory           = require('../models/SubCategories');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for get all article list
const getArticles = async (req, res) => {
    //todo add server side pagination
    try{
        await Article.find({}).then((result) => {
            if(!result) {
                throw new HTTPException("There is not article", HTTP.NOT_FOUND);
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

//? Controller for get article by sended id with get parametrs
const getArticle = async (req, res) => {
    try{
        await Article.findById({'_id' : req.params.id})
        .catch(error => {
            throw new HTTPException("Can't find any article by yout id", HTTP.NOT_FOUND)
        })
        .then((result) => {
            if(!result) {
                throw new HTTPException("Can't find any article by your id", HTTP.NOT_FOUND)
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

//? Controller for search articles by title from post method parametrs
const searchArticle = async (req, res) => {
    try{
        await Article.find({ title: {$regex: '.*' + req.body.title + '*.', $options: 'i'} })
        .then((result) => {
            if(!result) {
                throw new HTTPException("There is no articles by your request", HTTP.NOT_FOUND)
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


//? Controller for add new articles
const addArticle = async(req, res) => {
    try{
        const {
            title,
            author,
            image,
            shortDesc,
            content,
            category,
            subCategory
        } = req.body

        if(!title) {
            throw new HTTPException("Title doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!author) {
            throw new HTTPException("Author doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!image) {
            throw new HTTPException("Image doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!shortDesc) {
            throw new HTTPException("Short description doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!content) {
            throw new HTTPException("Content doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!category) {
            throw new HTTPException("Category doe's not exist", HTTP.BAD_REQUEST);
        }

        if(!subCategory) {
            throw new HTTPException("Sub category doe's not exist", HTTP.BAD_REQUEST);
        }

        await User.findById({"_id" : author}).catch(error => {
            throw new HTTPException("Auhtor by that id does not exist", HTTP.NOT_FOUND);
        })
        

        await Category.findById({"_id" : category}).catch(error => {
            throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
        });

        await SubCategory.findById({"_id" : subCategory}).catch(error => {
            throw new HTTPException("Sub category by that id does not  exist", HTTP.NOT_FOUND);
        })

        new Article({
            title,
            author,
            image,
            shortDesc,
            content,
            category,
            subCategory
        });

        await article.save();

        return res.status(HTTP.OK).json({"message" : "Article created successfuly"});
    }
    catch(exception) {
        console.log(exception);
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong :("
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}


module.exports = {
    getArticles,
    getArticle,
    searchArticle,
    addArticle
}
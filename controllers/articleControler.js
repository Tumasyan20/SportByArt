const Article               = require('../models/Articles');
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for get all article list
const getArticles = async (req, res) => {
    //todo add server side pagination
    try{
        const articles = await Article.find({});

        return res.status(HTTP.OK).json(articles);
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
        .exec((err, result) => {
            if(err) {
                return res.status(HTTP.BAD_REQUEST).json(err);
            }

            if(result == null) {
                return res.status(HTTP.NOT_FOUND).json({"message" : "Can't find any article by Your id."})
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

//? Controller for search articles by title from post method parametrs
const searchArticle = async (req, res) => {
    //todo if cant find any article by sended title, return exception
    try{
        await Article.find({ title: {$regex: '.*' + req.body.title + '*.', $options: 'i'} })
        .exec((err, result) => {
            if(err) {
                return res.status(HTTP.BAD_REQUEST).json(err)
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

        if(title || author || image || shortDesc || content || category || subCategory == false) {
            throw new HTTPException("Bad request", HTTP.BAD_REQUEST);
        }

        const article = new Article({
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
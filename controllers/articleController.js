//? Connecting db models
const Article               = require('../models/Articles');
const User                  = require('../models/Users');
const Category              = require('../models/Categories');
const SubCategory           = require('../models/SubCategories');


const { HTTP }              = require('../lib/constants');          //? exception status codes for response
const { HTTPException }     = require('../lib/HTTPexception');      //? custom js exception 



//? Controller for get all article list
const getArticles = async (req, res) => {
    try{
        let page = req.params.page;

        if(page == "all") {
            await Article.find({}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            )
            .sort('-publication').then((result) => {
                if(result.length == 0) {
                    throw new HTTPException("ARTICLE: No results!", HTTP.NOT_FOUND);
                }

                return res.status(HTTP.OK).json(result);
            });
        }
        else {
            page = parseInt(page);
            const limit = 10;
        
            await Article.find({}, 
                "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
            )
            .skip((page * limit) - limit).limit(limit)
            .sort('-publication').then((result) => {
                if(result.length == 0) {
                    throw new HTTPException("ARTICLE: No results!", HTTP.NOT_FOUND);
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

//? Controller for get article by sended id with get parametrs
const getArticle = async (req, res) => {
    try{
        await Article.findById({'_id' : req.params.id}, 
            "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
        )
        .catch(error => {
            throw new HTTPException("ARTICLE: Wrong id", HTTP.NOT_FOUND)
        })
        .then((result) => {
            if(result.length == 0) {
                throw new HTTPException("ARTICLE: Can't find any article by your id", HTTP.NOT_FOUND)
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
    try{
        await Article.find({ title: {$regex: '.*' + req.body.title + '*.', $options: 'i'} })
        .then((result) => {
            if(result.length == 0) {
                throw new HTTPException("ARTICLE: No results!", HTTP.NOT_FOUND)
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


//? Controller for add new articles
const addArticle = async(req, res) => {
    try{

        const authorInfo = await User.findById({"_id" : req.userData.userID}).catch(error => {
            if(error) {
                throw new HTTPException("ARTICLE: Authorization error", HTTP.BAD_REQUEST);
            }
        })
        .then((result) =>{
            if(result.length == 0) {
                throw new HTTPException("ARTICLE: Authorization error", HTTP.BAD_REQUEST);
            }

            if(result.root != 5) {
                throw new HTTPException("ARTICLE: No admin rights.", HTTP.CONFLICT);
            }

            return result;
        });

        const {
            title,
            author,
            shortDesc,
            content,
            category,
            subCategory,
        } = req.body

        const imageData = req.file;

        if(!title) {
            throw new HTTPException("ARTICLE: Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!shortDesc) {
            throw new HTTPException("ARTICLE: Short description does not exist", HTTP.BAD_REQUEST);
        }

        if(!content) {
            throw new HTTPException("ARTICLE: Content does not exist", HTTP.BAD_REQUEST);
        }

        if(!category) {
            throw new HTTPException("ARTICLE: Category id does not exist", HTTP.BAD_REQUEST);
        }

        if(!subCategory) {
            throw new HTTPException("ARTICLE: Sub category id does not exist", HTTP.BAD_REQUEST);
        }

        if(!imageData.path) {
            throw new HTTPException("ARTICLE: Image upload error", HTTP.BAD_REQUEST);
        }
        

        const categoryInfo = await Category.findById({"_id" : category}).catch(error => {
            throw new HTTPException("ARTICLE: Wrong category id", HTTP.NOT_FOUND);
        });

        const subCategoryInfo = await SubCategory.findById({"_id" : subCategory}).catch(error => {
            throw new HTTPException("ARTICLE: Wrong Sub category id", HTTP.NOT_FOUND);
        });

        const article = new Article({
            title,
            author_id: author,
            author_username: authorInfo.username,
            image : imageData.path,
            shortDesc,
            content,
            category_id : category,
            category_name: categoryInfo.title,
            subCategory_id: subCategory,
            subCategory_name: subCategoryInfo.title
        });

        await article.save();

        return res.status(HTTP.OK).json({"message" : "Article created successfuly"});
    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            console.log(exception)
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "ARTICLE: Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}


// const updateArticle = async (req, res) => {
//     if(!req.params.id) {
//         throw new HTTPException("ARTICLE: No id", HTTP.BAD_REQUEST);
//     }

//     const id = req.params.id;

//     await Article.findOneAndUpdate
// }

module.exports = {
    getArticles,
    getArticle,
    searchArticle,
    addArticle
}
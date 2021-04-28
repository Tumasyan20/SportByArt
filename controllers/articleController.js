//? Connecting node modules
const fs = require('fs');
const fileType = require('file-type');

//? Connecting db models
const Article               = require('../models/Articles');
const User                  = require('../models/Users');
const Category              = require('../models/Categories');
const SubCategory           = require('../models/SubCategories');
const Slider                 = require('../models/Slider');


const { HTTP }              = require('../lib/constants');          //? exception status codes for response
const { HTTPException }     = require('../lib/HTTPexception');      //? custom js exception 
const checkRights           = require('../lib/checkRights');        //? function for check user rights



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
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("ARTICLE: No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const authorInfo = await User.findById({"_id" : req.userData.userID})
        .then((result) => {
            if(result.length == 0) {
                throw new HTTPException("ARTICLE: There are no user by that id", HTTP.BAD_REQUEST);
            }
            return result;
        })

        const {
            title,
            shortDesc,
            content,
            category,
            subCategory,
            image,
            slider
        } = req.body


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

        if(!image) {
            throw new HTTPException("ARTICLE: Image does not exist", HTTP.BAD_REQUEST);
        }

        if(!slider) {
            throw new HTTPException("ARTICLE: Slider does not exist", HTTP.BAD_REQUEST);
        }

        const categoryInfo = await Category.findById({"_id" : category}).catch(error => {
            throw new HTTPException("ARTICLE: Wrong category id", HTTP.NOT_FOUND);
        });

        const subCategoryInfo = await SubCategory.findById({"_id" : subCategory}).catch(error => {
            throw new HTTPException("ARTICLE: Wrong Sub category id", HTTP.NOT_FOUND);
        });

        let imagePath = './uploads/images/' + Date.now() + '.jpeg';

        const base64image = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        fileType.fromBuffer(Buffer.from(base64image, 'base64'))
        .then((result) => {
            if(!result.mime.includes('image'))
                throw new HTTPException("ARTICLE: File is no image", HTTP.FORBIDDEN);
        });
        fs.writeFileSync(imagePath, base64image, {encoding: 'base64'});
        imagePath = imagePath.substring(1);

        

        const article = new Article({
            title,
            author_id: authorInfo._id,
            author_username: authorInfo.username,
            image : imagePath,
            shortDesc,
            content,
            category_id : category,
            category_name: categoryInfo.title,
            subCategory_id: subCategory,
            subCategory_name: subCategoryInfo.title
        });

        await article.save();

        for(i in slider) {
            let sliderPath = './uploads/slider/' + Date.now() + '.jpeg';

            const base64slider = slider[i].replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            fileType.fromBuffer(Buffer.from(base64slider, 'base64'))
            .then((result) => {
                if(!result.mime.includes('image'))
                    throw new HTTPException("ARTICLE: File is no image", HTTP.FORBIDDEN);
            });
            fs.writeFileSync(sliderPath, base64slider, {encoding: 'base64'});
            sliderPath = sliderPath.substring(1);
            
            const ImgSlider = new Slider({
                image: sliderPath,
                article: article._id
            });

            await ImgSlider.save();

        }

        return res.status(HTTP.OK).json({"message" : "Article created successfuly", article});
    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "ARTICLE: Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}


// const updateArticle = async (req, res) => {
//     try {
//         const {
//             articleId,
//             title,
//             shortDesc,
//             content,
//             category,
//             subCategory,
//             image
//         }
//     }
//     catch(exception) {
//         if(!(exception instanceof HTTPException)) {
//             exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
//             exception.message = "ARTICLE: Somethind went wrong"
//         }
//         return res.status(exception.statusCode).json({ message: exception.message });
//     }
// }

module.exports = {
    getArticles,
    getArticle,
    searchArticle,
    addArticle
}
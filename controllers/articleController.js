//? Connecting node modules
const fs = require('fs');
const fileType = require('file-type');


//? Connecting db models
const Article               = require('../models/Articles');
const User                  = require('../models/Users');
const Category              = require('../models/Categories');
const SubCategory           = require('../models/SubCategories');
const Slider                 = require('../models/Slider');


//? Connecting costum modules
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
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results!", HTTP.NOT_FOUND);
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
                if(result == null || result.length == 0) {
                    throw new HTTPException("No results!", HTTP.NOT_FOUND);
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
        const article = await Article.findById({'_id' : req.params.id}, 
            "title author_id author_username image shortDesc publication rating category_id category_name subCategory_id subCategory_name"
        )
        .catch(error => {
            throw new HTTPException("Wrong id", HTTP.NOT_FOUND)
        })
        .then((result) => {
            if( result == null || result.length == 0) {
                throw new HTTPException("Can't find any article by your id", HTTP.NOT_FOUND)
            }

            return result;
        });

        let slider = {};

        await Slider.find({"article" : article._id}).then((result) => {
            if(result != null || result.length != 0) {
                for(let i of result) {
                    const id = i._id
                    slider[id] = i
                }
            }

        });

        return res.status(HTTP.OK).json({article, slider});
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
            if(result == null || result.length == 0) {
                throw new HTTPException("No results!", HTTP.NOT_FOUND)
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
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const authorInfo = await User.findById({"_id" : req.userData.userID})
        .then((result) => {
            if(result.length == 0) {
                throw new HTTPException("There are no user by that id", HTTP.BAD_REQUEST);
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
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!shortDesc) {
            throw new HTTPException("Short description does not exist", HTTP.BAD_REQUEST);
        }

        if(!content) {
            throw new HTTPException("Content does not exist", HTTP.BAD_REQUEST);
        }

        if(!category) {
            throw new HTTPException("Category id does not exist", HTTP.BAD_REQUEST);
        }

        if(!subCategory) {
            throw new HTTPException("Sub category id does not exist", HTTP.BAD_REQUEST);
        }

        if(!image) {
            throw new HTTPException("Image does not exist", HTTP.BAD_REQUEST);
        }

        if(!slider) {
            throw new HTTPException("Slider does not exist", HTTP.BAD_REQUEST);
        }

        const categoryInfo = await Category.findById({"_id" : category}).catch(error => {
            throw new HTTPException("Wrong category id", HTTP.NOT_FOUND);
        });

        const subCategoryInfo = await SubCategory.findById({"_id" : subCategory}).catch(error => {
            throw new HTTPException("Wrong Sub category id", HTTP.NOT_FOUND);
        });

        let imagePath = './uploads/images/' + Date.now() + '.jpeg';

        const base64image = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        fileType.fromBuffer(Buffer.from(base64image, 'base64'))
        .then((result) => {
            if(!result.mime.includes('image'))
                throw new HTTPException("File is no image", HTTP.FORBIDDEN);
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

        for(let i in slider) {
            let sliderPath = './uploads/slider/' + Date.now() + '.jpeg';

            const base64slider = slider[i].replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            fileType.fromBuffer(Buffer.from(base64slider, 'base64'))
            .then((result) => {
                if(!result.mime.includes('image'))
                    throw new HTTPException("File is no image", HTTP.FORBIDDEN);
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
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for update articles
const updateArticle = async (req, res) => {
    try {

        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            articleId,
            title,
            shortDesc,
            content,
            category,
            subCategory,
            image,
            slider
        } = req.body;

        if(!articleId) {
            throw new HTTPException("Article Id does not exist", HTTP.BAD_REQUEST);
        }


        let article = await Article.findOne({"_id" : articleId})
        .catch((err) => {
            if(err) {
                throw new HTTPException("Wrong article id", HTTP.BAD_REQUEST);
            }
        })
        .then((result) => {
            if(result.length == 0) {
                throw new HTTPException("No results", HTTP.NOT_FOUND);
            }

            return result;
        });


        if(title) article.title = title;

        if(shortDesc) article.title = title;

        if(content) article.content = content;

        if(category) article.category = category;

        if(subCategory) article.subCategory = subCategory;

        if(image) {

            let imagePath = './uploads/images/' + Date.now() + '.jpeg';

            const base64image = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            fileType.fromBuffer(Buffer.from(base64image, 'base64'))
            .then((result) => {
                if(!result.mime.includes('image'))
                    throw new HTTPException("File is no image", HTTP.FORBIDDEN);
            });
            fs.writeFileSync(imagePath, base64image, {encoding: 'base64'});
            fs.unlinkSync('.' + article.image);
            imagePath = imagePath.substring(1);
            article.image = imagePath;
        }
        
        if(slider) {
            for(let i in slider) {

                if(slider[i].delete) {
                    await Slider.findOneAndRemove({"image": slider[i].path});
                }
                else 
                {
                    const sliderImage = await Slider.findOne({"image" : slider.path})
                    .catch(error => {
                        if(error) {
                            throw new HTTPException("Wrong slider image path", HTTP.BAD_REQUEST);
                        }
                    })
                    .then((result) => {
                        if(result.length == 0) {
                            throw new HTTPException("No results", HTTP.NOT_FOUND);
                        }
    
                        return result;
                    });

                    fs.unlinkSync('.' + sliderImage.path);

                    let sliderImagePath = './uploads/slider/' + Date.now() + '.jpeg';

                    const base64slider = slider[i].code.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                    
                    fileType.fromBuffer(Buffer.from(base64slider, 'base64'))
                    .then((result) => {
                        if(!result.mime.includes('image'))
                            throw new HTTPException("File is no image", HTTP.FORBIDDEN);
                    });

                    fs.writeFileSync(sliderImagePath, base64slider, {encoding: 'base64'});

                    sliderImagePath = sliderImagePath.substring(1);
                    slider.image = sliderImagePath;
                    slider.save();
                }
            }
        }

        article.save();

        return res.status(HTTP.OK).json({"message" : "Article updated successfuly"});
    }
    catch(exception) {
        if(!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = "Somethind went wrong"
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for delete article
const deleteArticle = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const article = await Article.findById({'_id' : req.params.id})
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
        

        await article.deleteOne();
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
    getArticles,
    getArticle,
    updateArticle,
    searchArticle,
    addArticle,
    deleteArticle
}
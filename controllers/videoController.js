//? Connectin db models
const Video         = require("../models/Videos");
const Category      = require('../models/Categories');
const User          = require('../models/Users');

//? Connecting custom models
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');

//? Controller for get video by id
const getVideo = async (req, res) => {
    try{
        await Video.findById({"_id" : req.params.id}).catch(exception => {
            if(exception) {
                throw new HTTPException("Wrong id", HTTP.BAD_REQUEST);
            }
        }).then((result) => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.NOT_FOUND);
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


//? Controller for get all video list
const getVideos = async (req, res) => {
    try {
        let page = req.params.page;

        if(page == 'all') {
            await Video.find({}).then((result) => {
                if(!result) {
                    throw new HTTPException("There are now videos", HTTP.NOT_FOUND);
                }
        
                return res.status(HTTP.OK).json(result);
            });
        }
        else {
            page = parseInt(page);
            const limit = 10;
            
            await Video.find({})
            .skip((page * limit) - limit).limit(limit)
            .then((result) => {
                if(!result) {
                    throw new HTTPException("There are now videos", HTTP.NOT_FOUND);
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

//? Controller for get category video list
const getVideosByCat = async (req, res) => {
    try {
        const categoryId = req.params;

        await Category.findById({"_id" : categoryId}).catch(error => {
            if(error) {
                throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
            }
        });

        await Video.find({"category_id" : categoryId}).then(result => {
            if(!result) {
                throw new HTTPException("There are no videos", HTTP.NOT_FOUND);
            }
            return res.status(HTTP.OK).json(result);
        });
    }
    catch (exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for add new video
const addVideo = async (req, res) => {
    try {
        const author = await User.findById({"_id" : req.userData.userID}).catch(error => {
            if(error) {
                throw new HTTPException("Authorization error", HTTP.BAD_REQUEST);
            }
        })
        .then((result) =>{
            if(result.length == 0) {
                throw new HTTPException("Authorization error", HTTP.BAD_REQUEST);
            }

            return result;
        });

        if(!checkRights(author.id, 5)) {
            throw new HTTPException("No admin rights", HTTP.FORBIDDEN);
        }

        const {
            title,
            description,
            video,
            category_id,
        } = req.body;

        const author_id = author.id;
        const author_username = author.username;

        let category_name;

        if(!title) {
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!description) {
            throw new HTTPException("Description does not exist", HTTP.BAD_REQUEST);
        }

        if(!video) {
            throw new HTTPException("Video url does not exist", HTTP.BAD_REQUEST);
        }

        if(!category_id) {
            throw new HTTPException("Video category does not exist", HTTP.BAD_REQUEST);
        }


        await Category.findById({"_id" : category_id})
        .then(result => {
            category_name = result.title;
        })
        .catch(error => {
            if(error) {
                throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
            }
        });

        const newVideo = new Video({
            title,
            description,
            video,
            category_id,
            category_name,
            author_id,
            author_username
        });

        newVideo.save();

        return res.status(HTTP.OK).json({"message" : "Video added successfuly", Video: newVideo});

    }
    catch (exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for update video
const updateVideo = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            video_id,
            title,
            author_id,
            description,
            video,
            category_id
        } = req.body;

        let author = ""
        let category = ""

        if(author_id && author_id != "" && author_id != undefined) {
            author = await User.findById({'_id' : author_id})
            .catch(err => {if(err) throw new HTTPException("Wrong author id", HTTP.BAD_REQUEST)})
            .then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("Cant find any user by that id", HTTP.BAD_REQUEST)
                }
    
                return result;
            });
        }
        
        if(category_id && category_id != "" && category_id != undefined) {
            category = await Category.findById({'_id' : category_id})
            .catch(err => {if(err) throw new HTTPException("Wrong id", HTTP.BAD_REQUEST)})
            .then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("Cant find any category by that id", HTTP.NOT_FOUND);
                }
    
                return result;
            });
        }
        

        const updatedVideo = await Video.findById({'_id' : video_id})
        .catch(err => {if(err) throw new HTTPException("Wrong id", HTTP.BAD_REQUEST)})
        .then((result) => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.BAD_REQUEST);
            }

            return result;
        });

        if(title && title != "" && title != undefined) updatedVideo.title = title;

        if(author != "" && author != undefined) {
            updatedVideo.author_id = author_id;
            updatedVideo.author_username = author.username;
        }

        if(description && description != "" && description != undefined) updatedVideo.description = description;

        if(video && video != "" && video != undefined) updatedVideo.video = video;

        if(category != "" && category != undefined) {
            updatedVideo.category_id = category_id
            updatedVideo.category_name = category.title
        }


        updatedVideo.save();

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

//? Controller for delete video
const deleteVideo = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const video = await Video.findById({'_id' : req.params.id})
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
        

        await video.deleteOne();
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
    getVideo,
    getVideos,
    getVideosByCat,
    addVideo,
    updateVideo,
    deleteVideo
}
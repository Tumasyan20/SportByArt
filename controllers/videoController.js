const Video         = require("../models/Videos");
const Category      = require('../models/Categories');
const User          = require('../models/Users');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? Controller for get all video list
const getVideos = async (req, res) => {
    try {
        await Video.find({}).then((result) => {
            //todo video list pagination
            if(!result) {
                throw new HTTPException("There are now videos", HTTP.NOT_FOUND);
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
};

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
};


//? Controller for add new video
const addVideo = async (req, res) => {
    try {
        const {
            title,
            description,
            video,
            category_id,
            author_id
        } = req.body;

        let author_username;
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

        if(!author_id) {
            throw new HTTPException("Author does not exist", HTTP.BAD_REQUEST);
        }

        await Category.findById({"_id" : category})
        .then(result => {
            category_name = result.title;
        })
        .catch(error => {
            if(error) {
                throw new HTTPException("Category by that id does not exist", HTTP.NOT_FOUND);
            }
        });

        await User.findById({"_id" : author})
        .then((result) => {
            author_username = result.username;
        })
        .catch(error => {
            if(error) {
                throw new HTTPException("Author by that id does not exist", HTTP.NOT_FOUND);
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

        return res.status(HTTP.OK).json({"message" : "Video added successfuly"});

    }
    catch (exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
};

module.exports = {
    getVideos,
    getVideosByCat,
    addVideo
}
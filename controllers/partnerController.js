//? Connecting node modules
const fs = require('fs');
const fileType = require('file-type');

const Partners = require('../models/Partners');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');


//? Controller for add new partner
const addPartner =  async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const {
            title,
            image
        } = req.body;

        let url = req.body.url;

        if(!title) {
            throw new HTTPException("Title does not exist", HTTP.BAD_REQUEST);
        }

        if(!image) {
            throw new HTTPException("Image does not exist", HTTP.BAD_REQUEST);
        }

        if(!url) {
            url = "";
        }

        let imagePath = './uploads/partners/' + Date.now() + '.jpeg';

        const base64image = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        fileType.fromBuffer(Buffer.from(base64image, 'base64'))
        .then((result) => {
            if(!result.mime.includes('image'))
                throw new HTTPException("File is no image", HTTP.FORBIDDEN);
        });
        fs.writeFileSync(imagePath, base64image, {encoding: 'base64'});
        imagePath = imagePath.substring(1);

        const partner = new Partners({
            title,
            image: imagePath,
            url
        });

        await partner.save();

        return res.status(HTTP.OK).json({'message': "Success!", partner});
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for get all partners list
const getPartners =  async (req, res) => {
    try {
        await Partners.find({}).then(result => {
            if(result == null || result.length == 0) {
                return res.status(HTTP.NOT_FOUND).json({"message" : "No result!"});
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

//? Controller for delete partner
const deletePartner = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const partner = await Partners.findById({"_id" : req.params.id}).catch(error => {
            throw new HTTPException("Wrong id", HTTP.BAD_REQUEST);
        })
        .then(result => {
            if(result == null || result.length == 0) {
                throw new HTTPException("No result", HTTP.NOT_FOUND);
            }

            return result;
        });

        await partner.deleteOne();
        return res.status(HTTP.OK).json({'message' : 'Success'});
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
    addPartner,
    getPartners,
    deletePartner
}
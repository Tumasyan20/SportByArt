//? Connecting db model(s)
const Settings = require('../models/Settings');

//? connecting custom moduls
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');


//? Controller for get site settings
const getSettings = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        let settings = await Settings.find({}).then((result) => {return result});

        if(settings == null || settings.length == 0) {
            settings = await new Settings({});

            settings.save();
        }

        return res.status(HTTP.OK).json(settings);

    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for update settings
const updateSettings = async (req, res) => {
    try{
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const { 
            about_us_title,  
            about_us_content,
            email_username,
            email_password
        } = req.body;

        let settings = await Settings.find({});

        if(about_us_title) settings[0].about_us_title = about_us_title;

        if(about_us_content) settings[0].about_us_content = about_us_content;

        if(email_username)  settings[0].email_username = email_username;

        if(email_password) settings[0].email_password = email_password;


        settings[0].save()

        return res.status(HTTP.OK).json({ message: "Success!", settings})

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
    getSettings,
    updateSettings
}
const SubCategory           = require("../models/SubCategories");
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


const addSubCategory = async (req, res) => {
    try {
        const {
            title,
            category
        } = req.body;
    
        const subCategories = new SubCategory({
            title,
            category
        });
    
        await subCategories.save();
    
        return res.status(HTTP.CREATED).json({"message" : "Sub category created successfuly!"})
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

const getSubCategories = async (req, res) => {
    
    try {
        const subCategories = await SubCategory.find({});

        return res.status(HTTP.OK).json(subCategories);
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
    addSubCategory,
    getSubCategories
}
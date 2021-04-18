const Article           = require('../models/Articles');
const Category          = require('../models/Categories');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');

const index = async (req, res) => {
    try {
        const categories = await Category.find({show_in_nav: true}).then((result) => {
            if(result.length == 0) {
                throw new HTTPException("INDEX: There are no categories", HTTP.NOT_FOUND);
            }
            return result;
        });
        
        let finalResult = {"lastet_news" : {}, "content" : {}};


        await Article.find({})
        .sort('-publication').limit(3)
        .then((result) => {
            finalResult.lastet_news = result;
        });

        for(i in categories) {
            await Article.find({category_id: categories[i]._id})
            .limit(6)
            .sort('-publication')
            .catch(error => { 
                if(error) {
                    throw new HTTPException("Server error", HTTP.INTERNAL_SERVER_ERROR)
                }
            })
            .then((result) => {
                console.log("1", finalResult);
                const id = categories[i]._id;
                console.log("2", finalResult);

                finalResult.content[id] = {};
                console.log("3", finalResult);

                finalResult.content[id].title = categories[i].title;
                console.log("4", finalResult);

                finalResult.content[id].articles = result;
                console.log("5", finalResult);

            });
        }

        return res.status(HTTP.OK).json(finalResult);
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

module.exports = {
    index
}
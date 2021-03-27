const Comment               = require('../models/Comments');
const Article               = require('../models/Articles');

const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');


//? controller for get article comments by sended article id
const getComment = async (req, res) => {
    try{
        const {articleId} = req.params;
        if(!articleId) {
            throw new HTTPException("Article id does not exist", HTTP.BAD_REQUEST);
        }

        await Article.findById({"_id" : articleId}).catch(error => {
            throw new HTTPException("Article by that id does not found", HTTP.NOT_FOUND);
        });

        await Comment.find({ "article" : articleId }).then((result) => {
            return res.status(HTTP.OK).json(result);
        });

    }
    catch(exception) {
        console.log(exception);
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}



//? controller for add new comments
const addComment = async (req, res) => {
    try {
        const {
            articleId,
            commentator_username,
            commentator_email,
            comment_content
        } = req.body;

        await Article.findById({"_id" : articleId}).catch(error => {
            throw new HTTPException("Article by that id does not found", HTTP.NOT_FOUND);
        });

        const comment = new Comment({
            username: commentator_username,
            email: commentator_email,
            content: comment_content,
            article: articleId
        });

        await comment.save();
        return res.status(HTTP.OK).json({"message" : "Comment added successfuly!"});
    }
    catch(exception) {
        console.log(exception);
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

module.exports = {
    getComment,
    addComment
}
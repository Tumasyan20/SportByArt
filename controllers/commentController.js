//? Connecting db models
const Comment               = require('../models/Comments');
const Article               = require('../models/Articles');

//? Connecting custom moduls
const { HTTP }              = require('../lib/constants');
const { HTTPException }     = require('../lib/HTTPexception');
const checkRights           = require('../lib/checkRights');


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
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? controller for get all comments
const getComments = async (req, res) => {
    try {
        let page = req.params.page;
        if(page == "all") {
            await Comment.find({}).then((result) => {
                if(!result) {
                    return res.status(HTTP.NOT_FOUND).json({"message" : "There are no comments"});
                }
                return res.status(HTTP.OK).json(result);
            });
        }
        else {
            page = parseInt(page);
            const limit = 10;

            const comments = await Comment.find({})
            .skip((page * limit) - limit).limit(limit)
            .then(result => {
                if(result == null || result.length == 0) {
                    throw new HTTPException("No result", HTTP.NOT_FOUND);
                }

                return result;
            });

            const count = await Comment.countDocuments();
            const pageCount = Math.ceil(count/limit);

            return res.status(HTTP.OK).json({'pageCount' : pageCount, comments});
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


//? controller for add new comments
const addComment = async (req, res) => {
    try {
        const {
            articleId,
            commentator_username,
            commentator_email,
            comment_content
        } = req.body;

        if(!articleId) {
            throw new HTTPException("ArticleId does not exist", HTTP.BAD_REQUEST);
        }

        if(!commentator_username) {
            throw new HTTPException("Commentator username does not exist", HTTP.BAD_REQUEST);
        }

        if(!commentator_email) {
            throw new HTTPException("Commentator email does not exist", HTTP.BAD_REQUEST);
        }

        if(!comment_content) {
            throw new HTTPException("Comment content does not exist", HTTP.BAD_REQUEST);
        }

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
        return res.status(HTTP.OK).json({"message" : "Comment added successfuly!", comment});
    }
    catch(exception) {
        if (!(exception instanceof HTTPException)) {
            exception.statusCode = HTTP.INTERNAL_SERVER_ERROR;
            exception.message = 'Something went wrong';
        }
        return res.status(exception.statusCode).json({ message: exception.message });
    }
}

//? Controller for delete comment
const deleteComment = async (req, res) => {
    try {
        if(!checkRights(req.userData.userID, 5)) {
            throw new HTTPException("No admin rights for add new article", HTTP.FORBIDDEN);
        }

        const comment = await Comment.findById({'_id' : req.params.id})
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
        

        await comment.deleteOne();
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
    getComment,
    getComments,
    addComment,
    deleteComment
}
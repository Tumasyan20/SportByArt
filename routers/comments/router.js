const express   = require('express');
const router    = express.Router();

const Authenticate = require('../../middlewares/authenticate');       //? Connecting authenticate middleware

const commentController = require('../../controllers/commentController');       //? Connect comment controller

router.get('/list/:articleId', commentController.getComment);                   //? Route for get comment list by article id
router.get('/get/list/:page', commentController.getComments);                   //? route for get all cooment list
router.post('/add', commentController.addComment);                              //? route for add new comment
router.delete('/delete/:id', Authenticate, commentController.deleteComment);    //? Route for delete comment


module.exports = router;
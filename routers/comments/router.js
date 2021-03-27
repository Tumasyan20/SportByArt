const express = require('express');
const router = express.Router();

const commentController = require('../../controllers/commentController');   //? Connect comment controller

router.get('/list/:articleId', commentController.getComment);       //? Route for get comment list by article id
router.post('/add', commentController.addComment);                  //? route for add new comment


module.exports = router;
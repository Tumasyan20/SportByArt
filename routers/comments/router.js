const express = require('express');
const router = express.Router();

const commentController = require('../../controllers/commentController');   //? Connect comment controller

router.get('/list/:articleId', commentController.getComment);
router.post('/add', commentController.addComment);


module.exports = router;
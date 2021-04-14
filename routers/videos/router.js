const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const videoController = require('../../controllers/videoController');       //? Connect video controller

router.get('/list', videoController.getVideos);             //? route for get video list
router.get('/:categoryId', videoController.getVideosByCat); //? route for get video list by category id
router.post('/add', videoController.addVideo);              //? route for add new video

module.exports = router;
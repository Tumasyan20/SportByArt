const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const videoController = require('../../controllers/videoController');       //? Connect video controller

router.get('/list', videoController.getVideos);         //? route for get video list
router.post('/add', videoController.addVideo);          //? route for add new video

module.exports = router;
const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const videoController = require('../../controllers/videoController');       //? Connect video controller

const Authenticate = require('../../middlewares/authenticate');

router.get('/list', videoController.getVideos);                             //? route for get video list
router.get('/:categoryId', videoController.getVideosByCat);                 //? route for get video list by category id
router.post('/add', Authenticate, videoController.addVideo);                //? route for add new video
router.delete('/delete/:id', Authenticate, videoController.deleteVideo);    //? Route for delete video

module.exports = router;
const express   = require('express');
const multer    = require('multer');

const storageConfig = require('../../lib/storageConfig');   //? connecting multer storage config, for uploading images
const imageFilter   = require('../../lib/imageFilter');     //? Connecting image type filter

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware

const router        = express.Router();


let upload = multer({storage: storageConfig('uploads/images/'), fileFilter: imageFilter})


const articleController = require('../../controllers/articleController');           //? importing article controller

router.get('/list/:page', articleController.getArticles);                           //? route for get all articles with pagination
router.get('/:id', articleController.getArticle);                                   //? route for get one article by id
router.post('/search', articleController.searchArticle);                            //? route for search articles by title in post request body
router.post('/add', Authenticate, upload.single("image"), articleController.addArticle);          //? route for add new article by values from request body

module.exports = router;
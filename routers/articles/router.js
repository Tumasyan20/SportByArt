const express   = require('express');

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware

const router        = express.Router();

const articleController = require('../../controllers/articleController');           //? importing article controller

router.get('/list/:page', articleController.getArticles);                           //? route for get all articles with pagination
router.get('/:id', articleController.getArticle);                                   //? route for get one article by id
router.put('/update', articleController.updateArticle);                             //? route for modify articles
router.post('/search', articleController.searchArticle);                            //? route for search articles by title in post request body
router.post('/add', Authenticate, articleController.addArticle);                    //? route for add new article by values from request body

module.exports = router;
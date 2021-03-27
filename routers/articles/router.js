const express = require('express');
const router = express.Router();

const articleController = require('../../controllers/articleControler');        //? import article controller

router.get('/list', articleController.getArticles);         //? route for get all articles with pagination
router.get('/:id', articleController.getArticle);           //? route for get one article by id
router.post('/search', articleController.searchArticle);    //? route for search articles by title in post request body
router.post('/add', articleController.addArticle);          //? route for add new article by values from request body

module.exports = router;
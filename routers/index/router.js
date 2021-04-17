const express   = require('express');
const router    = express.Router();

const indexController = require('../../controllers/indexController');

router.get('/', indexController.index);     //? using index router for get blog main page content

module.exports = router;
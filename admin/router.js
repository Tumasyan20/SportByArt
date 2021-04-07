const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const dashboardController = require('./controllers/dashboardController');

router.use('/test', dashboardController.test);          //? article router


module.exports = router;
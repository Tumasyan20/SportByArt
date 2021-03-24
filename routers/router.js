const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const articleRouter = require('./articles/router');         //? connect article router
const commentRouter = require('./comments/router');         //? connect comment router


router.use('/article', articleRouter);      //? article router
router.use('/comment', commentRouter);      //? comment router

module.exports = router;
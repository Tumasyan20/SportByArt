const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const articleRouter     = require('./articles/router');         //? connect article router
const commentRouter     = require('./comments/router');         //? connect comment router
const categoryRouter    = require('./categories/router');       //? connect categoriy router
const videoRouter       = require('./videos/router');           //? connect video router
const userRouter        = require('./users/router');            //? connect user router
const SubCategoryRouter = require('./subCategories/router');    //? connect sub category router
const subscribeRouter   = require('./subscribe/router');        //? connect email subscribe router
const settingsRouter    = require('./settings/router');         //? connect all site settings router
const indexRouter       = require('./index/router');            //? connect index page router


router.use('/article', articleRouter);          //? article router
router.use('/comment', commentRouter);          //? comment router
router.use('/category', categoryRouter);        //? category router
router.use('/sub-category', SubCategoryRouter); //? sub caregory router
router.use('/user', userRouter);                //? user router
router.use('/video', videoRouter);              //? video router
router.use('/subscribe', subscribeRouter);      //? subscribe router
router.use('/settings', settingsRouter);        //? settings router
router.use('/index', indexRouter);              //? using index router

module.exports = router;
const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');     //? Connecting authenticate middleware

const subscribeController = require('../../controllers/subscribeController');   //? Connect subscribe controller

router.get('/add/:email', subscribeController.subscribe);                           //? Route for subscribe user by email
router.get('/list', Authenticate, subscribeController.getSubscriberList);           //? Route for get subscribers list
router.post('/send', Authenticate, subscribeController.sendEmail);                  //? Route for send emails
router.delete('/delete/:email', Authenticate, subscribeController.deleteSubscribe); //? Route for delete email

module.exports = router;
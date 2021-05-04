const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');

const subscribeController = require('../../controllers/subscribeController'); 

router.get('/:email', subscribeController.subscribe);                   //? Route for subscribe user by email
router.post('/send', Authenticate, subscribeController.sendEmail);      //? Route for send emails

module.exports = router;
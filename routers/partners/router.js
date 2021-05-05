const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware

const partnerController = require('../../controllers/partnerController');       //? Connect partners controller

router.get('/get', partnerController.getPartners);                              //? Route for get web site all partners list
router.post('/add', Authenticate, partnerController.addPartner);                //? route for add new partner
router.delete('/delete/:id', Authenticate, partnerController.deletePartner);    //? Route for delete partner

module.exports = router;
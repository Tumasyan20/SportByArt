const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware

const settingsController = require('../../controllers/settingsController.js');  //? connecting settings controller


router.get('/', Authenticate, settingsController.getSettings);        //? Route for get all site settings
router.get('/about-us', settingsController.getAboutUs)                //? Route for get about us
router.get('/footer', settingsController.getFooter);                  //? Route for get footer
router.put('/', Authenticate, settingsController.updateSettings);     //? Route for update settings

module.exports = router;
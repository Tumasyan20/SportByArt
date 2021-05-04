const express   = require('express');
const router    = express.Router();         //? create express.js router variable

const Authenticate = require('../../middlewares/authenticate');     //? connecting authenticate middleware


const settingsController = require('../../controllers/settingsController.js'); 

router.get('/', Authenticate, settingsController.getSettings);        //? Route for get all site settings
router.put('/', Authenticate, settingsController.updateSettings);     //? Route for update settings

module.exports = router;
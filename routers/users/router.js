const express   = require('express');
const router    = express.Router();

const userController = require('../../controllers/userController');

router.post('/register', userController.registerUser);
router.get('/list', userController.getUsers);

module.exports = router;
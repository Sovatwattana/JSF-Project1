const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/usersController');

router.get('/new', UsersController.newUser);
router.post('/', UsersController.createUser);

module.exports = router;
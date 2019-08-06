const express = require('express');
const router = express.Router();

const SessionsController = require('../controllers/sessionsController');

router.get('/login', SessionsController.login);
router.post('/authenticate', SessionsController.authenticateUser);
router.post('/logout', SessionsController.logout);

module.exports = router;
const express = require('express');
const router = express.Router();

const RidersController = require('../controllers/ridersController');

router.get('/', RidersController.showRiders);
router.get('/new', RidersController.newRider);
router.get('/:id', RidersController.showRider);
router.get('/edit/:id', RidersController.editRider);
router.post('/', RidersController.createRider);
router.post('/update', RidersController.updateRider);
router.post('/delete', RidersController.deleteRider);

module.exports = router;

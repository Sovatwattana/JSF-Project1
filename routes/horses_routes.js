const router = require('express').Router();

const horsesController = require('../controllers/horsesController');

//Giselle wuz heer
router.get('/', horsesController.showHorses);
router.get('/horses', horsesController.showHorses);
router.get('/horses/new', horsesController.newHorse);
router.get('/horses/:id', horsesController.showHorse);
router.get('/horses/:id/edit', horsesController.editHorse);
router.post('/horses', horsesController.createHorse);
router.post('/horses/update', horsesController.updateHorse);
router.post('/horses/delete', horsesController.deleteHorse);

module.exports = router;
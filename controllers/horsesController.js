const Horse = require('../models/horse_db');
const RiderController = require('./ridersController');

function showHorses(request, response) {
    getHorses()
        .then(horses => {
            RiderController.getRiders()
                .then(riders => {
                    response.render('horses/index', {
                        horses: horses,
                        title: 'Horses',
                        riders: riders
                    });
                })
                .catch(error => {
                    displayError(request, error);
                });
        })
        .catch(error => {
            displayError(request, error);
        });
}

function showHorse(request, response) {
    Horse.findById(request.params.id)
        .then(horse => {
            RiderController.getRiderById(horse.riderId)
                .then(rider => {
                    response.render('horses/show', {
                        horse: horse,
                        title: horse.name,
                        rider: rider
                    });
                })
                .catch(error => {
                    displayError(request, error);
                });
        })
        .catch(error => {
            displayError(request, error);
        });
}

function newHorse(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        response.render('horses/new', {
            title: 'New Horse'
        });
    }
}

function updateHorse(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        Horse.updateOne({
            _id: request.body.id
        }, request.body.horse, {
            runValidators: true
        })
        .then(() => {
            successFeedback(request, 'updated');
            response.redirect(`/horses/${request.body.id}`);
        })
        .catch(error => {
            displayError(request, error);
        });
    }
}

function editHorse(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        Horse.findById(request.params.id)
        .then(horse => {
            response.render('horses/edit', {
                horse: horse,
                title: horse.name
            });
        })
        .catch(error => {
            displayError(request, error);
        });
    }
}

function createHorse(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        Horse.create(request.body.horse)
        .then(() => {
            successFeedback(request, 'created');
            response.redirect('/horses');
        })
        .catch(error => {
            displayError(request, error);
        });
    }
}

function deleteHorse(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        Horse.deleteOne({
            _id: request.body.id
        })
        .then(() => {
            successFeedback(request, 'deleted');
            response.redirect('/horses');
        })
        .catch(error => {
            displayError(request, error);
        });
    }
}
//-------------------------------------------------------
function getRiderless() {
    return getHorses().getRiderless();
}

function registerRider(riderId, horseId) {
    Horse.updateOne({
            _id: horseId
        }, {
            riderId: riderId
        }, {
            runValidators: true
        }).then()
        .catch(error => {
            displayError(request, error);
        });
}

function getHorses() {
    return Horse.find();
}

function getRiderHorse(riderId) {
    return Horse.find().getHorseOfRider(riderId);
}

function displayError(request, error) {
    request.flash('error', `Error: ${error}`);
}

function successFeedback(request, action) {
    request.flash('success', `Horse has been ${action} successfully.`);
}

exports.showHorses = showHorses;
exports.showHorse = showHorse;
exports.newHorse = newHorse;
exports.updateHorse = updateHorse;
exports.editHorse = editHorse;
exports.createHorse = createHorse;
exports.deleteHorse = deleteHorse;
exports.getRiderless = getRiderless;
exports.registerRider = registerRider;
exports.getHorses = getHorses;
exports.displayError = displayError;
exports.successFeedback = successFeedback;
exports.getRiderHorse = getRiderHorse;
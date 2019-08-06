const RiderDB = require('../models/rider_db');
const HorsesController = require('./horsesController');

function showRiders(request, response) {
    getRiders()
        .then(riders => {
            HorsesController.getHorses()
                .then(horses => {
                    response.render('riders/index', {
                        title: 'Riders',
                        riders: riders,
                        horses: horses
                    })
                })
                .catch((error) => {
                    displayError(request, error)
                });
        })
        .catch((error) => {
            displayError(request, error)
        });
}

function showRider(request, response) {
    getRiderById(request.params.id)
        .then(rider => {
            HorsesController.getRiderHorse(rider.id)
                .then(horse => {
                    response.render('riders/show', {
                        title: rider.name,
                        rider: rider,
                        horse: horse
                    });
                })
                .catch((error) => {
                    displayError(request, error);
                });
        })
        .catch((error) => {
            displayError(request, error);
        });
}

function newRider(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        HorsesController.getRiderless()
        .then(horses => {
            response.render('riders/new', {
                title: 'New Rider',
                horses: horses
            });
        })
        .catch((error) => {
            displayError(request, error);
        });
    }
}

function updateRider(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        RiderDB.updateOne({
            _id: request.body.id
        }, {
            name: request.body.name,
            dateOfBirth: request.body.dateOfBirth,
            gender: request.body.gender,
            lastWeighIn: request.body.lastWeighIn,
            earnings: request.body.earnings
        }, {
            runValidators: true
        })
        .then(() => {
            HorsesController.getRiderHorse(request.body.id)
                .then(horses => {
                    if (horses.length != 0) {
                        HorsesController.registerRider(null, horses[0].id); // unhook the old
                    }
                    HorsesController.registerRider(request.body.id, request.body.horseId); // hook the new
                })
                .catch((error) => {
                    displayError(request, error)
                });
            successFeedback(request, 'updated');
            response.redirect(`/riders/${request.body.id}`)
        })
        .catch((error) => {
            displayError(request, error)
        });
    }
}

function editRider(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        getRiderById(request.params.id)
        .then(rider => {
            HorsesController.getHorses()
                .then(horses => {
                    response.render('riders/edit', {
                        title: `Edit ${rider.name}`,
                        rider: rider,
                        horses: horses
                    });
                }).catch((error) => {
                    displayError(request, error);
                });
        })
        .catch((error) => {
            displayError(request, error)
        });
    }
}

function createRider(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        RiderDB.create({
            name: request.body.name,
            dateOfBirth: request.body.dateOfBirth,
            gender: request.body.gender,
            lastWeighIn: request.body.lastWeighIn,
            earnings: request.body.earnings
        })
        .then((rider) => {
            successFeedback(request, 'created');
            HorsesController.registerRider(rider.id, request.body.horseId);
            response.redirect('/riders');
        })
        .catch((error) => {
            displayError(request, error)
        });
    }
}

function deleteRider(request, response) {
    request.isAuthenticated();
    if (request.session && request.session.userId) {
        RiderDB.deleteOne({
            _id: request.body.id
        })
        .then(() => {
            HorsesController.getRiderHorse(request.body.id)
                .then(horses => {
                    HorsesController.registerRider(null, horses[0].id);
                    successFeedback(request, 'deleted');
                    response.redirect('/riders')
                })
                .catch((error) => {
                    displayError(request, error)
                });
        })
        .catch((error) => {
            displayError(request, error)
        });
    }
}

function getRiders() {
    return RiderDB.find();
}

function getRiderById(id) {
    return RiderDB.findById(id);
}

function displayError(request, error) {
    request.flash('error', `Error: ${error}`);
}

function successFeedback(request, action) {
    request.flash('success', `Rider has been ${action} successfully.`);
}

exports.showRiders = showRiders;
exports.showRider = showRider;
exports.newRider = newRider;
exports.updateRider = updateRider;
exports.editRider = editRider;
exports.createRider = createRider;
exports.deleteRider = deleteRider;
exports.getRiderById = getRiderById;
exports.getRiders = getRiders;
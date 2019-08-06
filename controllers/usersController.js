const UserDB = require('../models/user_db');

function newUser(request, response) {
    response.render('users/new', {
        title: 'New User'
    });
}

function createUser(request, response) {
    UserDB.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: request.body.password,
            passwordConfirmation: request.body.passwordConfirmation
        }).then((user) => {
            request.flash('success', `User ${user.firstName} has been created successfully`);
            response.redirect('/sessions/login');
        })
        .catch(() =>{ 
            request.flash('error', `Error: ${error}`);
            response.redirect('/users/new');
        });
}

exports.newUser = newUser;
exports.createUser = createUser;
const UserDB = require('../models/user_db');

function login(request, response) {
    response.render('sessions/login', {
        title: 'Login'
    });
}

function authenticateUser(request, response) {
    UserDB.findOne({
        email: request.body.email
    })
    .then(user => {
        user.authenticate(request.body.password, (error, isMatch) => {
            if (error) {
                throw new Error(error);
            }
            if (isMatch) {
                request.session.userId = user.id;
                request.flash('success', `Welcome back ${user.firstName}`);
                response.redirect('/');
            } else {
                request.flash('error', 'Error: Credentials do not match.');
                response.redirect('/sessions/login');
            }
        });
    })
    .catch(error => {
        request.flash('error', `ERROR: ${error}`);
    });
}

function logout(request, response) {
    UserDB.findById(request.session.userId)
    .then(user => {
        request.session.userId = null;
        request.flash('success', `Bye Bye ${user.firstName}`);
        response.redirect('/');
    })
    .catch(error => {
        request.flash('error', `ERROR: ${error}`);
    });   
}

module.exports.login = login;
module.exports.authenticateUser = authenticateUser;
module.exports.logout = logout;
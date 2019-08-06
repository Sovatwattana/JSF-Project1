const express = require('express');
const application = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes');
const dotEnv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || 4000;

dotEnv.config();

application.set('views', path.join(__dirname, 'views'));
application.set('view engine', 'pug');

application.use(cookieParser());
application.use(session({
    secret: (process.env.secret || 'boorakacha'),
    cookie: {
        maxAge: 10800000
    },
    resave: true,
    saveUninitialized: true
}));
application.use(flash());
application.use((req, res, next) => {
    res.locals.flash = res.locals.flash || {};
    res.locals.flash.success = req.flash('success') || null;
    res.locals.flash.error = req.flash('error') || null;
    next();
});
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect(process.env.DB_URI, {
    auth: {
        user: process.env.DB_USER_NAME,
        password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true  
}).catch(error => console.log(`ERROR: ${error}`));

function isAuthenticated(request) {
    if (request.session && request.session.userId) {
        return true;
    } else {
        return false;
    }
}

application.use((request, response, next) => {
    request.isAuthenticated = () => {
        if (!isAuthenticated(request)) {
            request.flash('error', 'You do not have the authority to do this action');
            response.redirect('/');
        }
    }
    response.locals.isAuthenticated = isAuthenticated(request);
    next();
});

application.use('/css', express.static('assets/stylesheets'));
application.use('/js', express.static('assets/javascripts'));
application.use('/images', express.static('assets/images'));

application.use('/', router);

application.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

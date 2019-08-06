const express = require('express');
const application = express();

const horsesRouter = require('./routes/horses_routes');
const ridersRouter = require('./routes/riders_routes');
const usersRouter = require('./routes/users_routes');
const sessionsRouter = require('./routes/sessions_routes');

application.use('/', horsesRouter);
application.use('/riders', ridersRouter);
application.use('/users', usersRouter);
application.use('/sessions', sessionsRouter);

module.exports = application;
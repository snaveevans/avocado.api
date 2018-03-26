var express = require('express');
var app = express();
var db = require('./db');

app.get('/', (req, res) => res.send({ version: '1.0.0'}));

var eventsController = require('./Controllers/EventsController');

app.use('/events', eventsController);

module.exports = app;
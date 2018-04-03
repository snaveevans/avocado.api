var express = require('express');
var app = express();
var db = require('./db');

app.get('/', (req, res) => res.send({ version: '1.0.0'}));

var eventsController = require('./controllers/EventsController');
var addressController = require('./controllers/AddressesController');
var accountsController = require('./controllers/AccountsController');

app.use('/events', eventsController);
app.use('/addresses', addressController);
app.use('/accounts', accountsController);

module.exports = app;
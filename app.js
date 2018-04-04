var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var fs = require('fs');
var { jwtSecret } = require('./constants');
var Account = require('./domain/Account');

// TODO: refactor out default '_id' for uuid 'id's
// TODO: research unquie keys for mongodb
// TODO: research 'foreign' keys for mongodb
// TODO: research data types for mongodb

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressJwt({
    secret: jwtSecret
}).unless({ path: ['/token', '/version'] }));

app.use((req, res, next) => {
    if (req.user && req.user.sub) {
        Account.findById(req.user.sub)
            .then(account => {
                if (account) {
                    req.account = account;
                    next();
                }
            })
    }
})

app.get('/version', (req, res) => res.status(200).send({ version: '1.0.0' }));

var tokenController = require('./controllers/TokenController');
var eventsController = require('./controllers/EventsController');
var addressController = require('./controllers/AddressesController');
var accountsController = require('./controllers/AccountsController');

app.use('/token', tokenController);
app.use('/events', eventsController);
app.use('/addresses', addressController);
app.use('/accounts', accountsController);

module.exports = app;
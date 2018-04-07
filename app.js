var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var Promise = require("bluebird");
var db = require('./db');
var { jwtSecret } = require('./constants');
var Account = require('./domain/Account');

// TODO: create helper class to retrieve entities from persistance

db.initialize();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressJwt({
    secret: jwtSecret
}).unless({ path: ['/token', '/version', '/accounts'] }));

app.use((req, res, next) => {
    Promise.onPossiblyUnhandledRejection(error => {
        console.error(error);
        res.status(500).send({ error: "well i tried" });
    })
    next();
})

app.use((req, res, next) => {
    if (req.user && req.user.sub) {
        Account.findById(req.user.sub)
            .then(account => {
                if (account) {
                    req.account = account;
                }
                return next();
            })
    }
    else
        return next();
});

app.get('/version', (req, res) => res.status(200).send({ version: '1.0.0' }));

var tokenController = require('./controllers/TokenController');
var eventsController = require('./controllers/EventsController');
var addressController = require('./controllers/AddressesController');
var accountsController = require('./controllers/AccountsController');

app.use('/token', tokenController);
app.use('/events', eventsController);
app.use('/addresses', addressController);
app.use('/accounts', accountsController);

app.use(function (req, res) {
    res.status(404).send({ error: "Could you come over here?" })
})

app.use(function (err, req, res) {
    console.error(err);
    res.status(500).send({ error: "You've made your point." });
});

module.exports = app;
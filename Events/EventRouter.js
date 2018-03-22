var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var eventsController = require('./EventsController');

router.use('/', eventsController);

module.exports = router;
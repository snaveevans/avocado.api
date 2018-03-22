var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Event = require('../Domain/Event');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    Event.find()
        .then(events => {
            res.status(200).send(events);
        });
});

router.get('/:id', function (req, res) {
    Event.findById(req.params.id)
        .then(event => {
            res.status(200).send(event);
        });
})

router.post('/', function (req, res) {
    var { title, description, date } = req.body;

    var err = Event.getErrors({ title, description, date });

    if (err) {
        res.status(400).send({ error: err });
        return;
    }

    var event = Event.create({ title, description, date })
        .then(event => {
            res.status(200).send(event);
        })
        .catch(reason => {
            res.status(500).send();
        })
})

module.exports = router;
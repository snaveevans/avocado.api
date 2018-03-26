var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Event = require('../Domain/Event');
var itemsController = require('./ItemsController');

router.use('/:eventId/items', itemsController);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in events controller');
    console.log(err);
};

router.get('/', (req, res) => {
    Event.find({})
        .then(events => {
            res.status(200).send(events);
        })
        .catch(err => handleError(res, req, err));
});

router.get('/:eventId', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            res.status(200).send(event);
        })
        .catch(err => handleError(res, req, err));
});

router.post('/', (req, res) => {
    var { title, description, date } = req.body;

    var error = Event.isValid({ title, description, date });

    if (error) {
        res.status(400).send({ error });
        return;
    }

    var event = Event.create({ title, description, date })
        .then(event => {
            res.status(201).send(event);
        })
        .catch(err => handleError(res, req, err));
});

router.put('/:eventId', (req, res) => {

});

router.delete('/:eventId', (req, res) => {
    Event.delete(req.params.id)
        .then(info => {
            res.status(204).send();
        })
        .catch(err => handleError(res, req, err));
});

module.exports = router;
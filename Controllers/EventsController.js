var express = require('express');
var router = express.Router();
var Event = require('../domain/Event');

var itemsController = require('./ItemsController');
var rolesController = require('./RolesController');
router.use('/:eventId/items', itemsController);
router.use('/:eventId/roles', rolesController);

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

router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            if (!event)
                res.status(400).send({ error: 'no event' });
            else
                res.status(200).send(event);
        })
        .catch(err => handleError(res, req, err));
});

router.post('/', (req, res) => {
    var { title, description, date } = req.body;

    var error = Event.isValid({ title, description, date });

    if (error)
        return res.status(400).send({ error });
     
    var event = Event.create({ title, description, date }, req.account)
    .then(event => {
            res.status(201).send(event);
        })
    .catch(err => handleError(res, req, err));
    }); 

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {
    Event.delete(req.params.id)
        .then(info => {
            res.sendStatus(204);
        })
        .catch(err => handleError(res, req, err));
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Event = require('../domain/Event');

var { authorizeEvent, authorize, appendAccount } = require('../helper');

router.use(authorize());
router.use(appendAccount());

// Authorize event ids
router.use(authorizeEvent());

var itemsController = require('./ItemsController');
var rolesController = require('./RolesController');

router.use('/:eventId/items', itemsController);
router.use('/:eventId/roles', rolesController);

router.get('/', (req, res) => {
    Event.getAllEvents(req.account)
        .then(events => {
            res.status(200).send(events);
        });
});

router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            if (event)
                return res.status(200).send(event);
            return res.status(400).send({ error: 'no event' });
        })
});

router.post('/', (req, res) => {
    var { title, description, date } = req.body;

    var isValid = Event.isValid({
        date,
        description,
        title
    });

    if (!isValid)
        return res.status(400).send();

    Event.create({
        date,
        description,
        title
    }, req.account)
        .then(event => {
            res.status(201).send(event);
        })
});

router.delete('/:id', (req, res) => {
    Event.delete(req.params.id)
        .then(() => res.sendStatus(204));
});

router.post('/:id/votes', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            event.addVote(req.account)
                .save()
                .then(updatedEvent => res.status(201).send(updatedEvent.votes))
        })
});

router.delete('/:id/votes', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            event.removeVote(req.account)
                .save()
                .then(() => res.sendStatus(204))
        })
});

module.exports = router;
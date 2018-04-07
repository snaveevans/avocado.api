var express = require('express');
var router = express.Router();
var Event = require('../domain/Event');

// Authorize event ids
router.use((req, res, next) => {
    var { path } = req;

    if (path === '/') {
        return next();
    }
    var sections = path.split('/');

    if (sections.length >= 2) {
        var [, eventId] = sections;

        if (!req.account)
            return res.sendStatus(401);

        Event.findById(eventId)
            .then(event => {
                if (!event)
                    return res.sendStatus(401);

                event.hasAccess(req.account)
                    .then(hasAccess => {
                        if (hasAccess) {
                            req.event = event;
                            return next();
                        }
                        return res.sendStatus(401);
                    })
            })
    }
    else
        return next();
});

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

    var error = Event.isValid({
        date,
        description,
        title
    });

    if (error)
        return res.status(400).send({ error });

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

module.exports = router;
var express = require('express');
var router = express.Router({ mergeParams: true });
var Item = require('../domain/Item');
var Address = require('../values/Address');

router.get('/', (req, res) => {
    var { eventId } = req.params;

    Item.find({ eventId })
        .then(items => {
            res.status(200).send(items);
        })
});

router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => res.status(200).send(item));
});

router.post('/time', (req, res) => {
    var { end, start } = req.body;
    var { eventId } = req.params;

    var error = Item.isTimeValid({
        end,
        start
    });

    if (error)
        return res.status(400).send({ error });

    Item.createTime({
        end,
        start
    }, eventId)
        .then(time => res.status(201).send(time));
});

router.post('/activity', (req, res) => {
    var { title, description } = req.body;
    var { eventId } = req.params;

    var error = Item.isActivityValid({
        description,
        title
    });

    if (error)
        return res.status(400).send({ error });

    Item.createActivity({
        description,
        title
    }, eventId)
        .then(activity => {
            res.status(201).send(activity);
        });
});

router.post('/location', (req, res) => {
    var { street, city, state, country } = req.body;
    var { eventId } = req.params;

    var addressError = Address.isValid({
        city,
        country,
        state,
        street
    });

    if (addressError) {
        res.status(400).send({ error: addressError });
        return;
    }

    Address.create({
        city,
        country,
        state,
        street
    })
        .then(address => {
            Item.createLocation(address, eventId)
                .then(location => {
                    res.status(201).send(location);
                });
        });
});

router.delete('/:id', (req, res) => {
    Item.delete(req.params.id)
        .then(info => {
            res.status(204).send(info);
        });
})

module.exports = router;
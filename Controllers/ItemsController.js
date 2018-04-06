var express = require('express');
var router = express.Router({ mergeParams: true });
var Item = require('../domain/Item');
var Address = require('../values/Address');

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in items controller');
    console.log(err);
}

router.get('/', (req, res) => {
    var eventId = req.params.eventId;
    Item.find({ eventId })
        .then(items => {
            res.status(200).send(items);
        })
});

router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => {
            res.status(200).send(item);
        });
});

router.post('/time', (req, res) => {
    var { start, end } = req.body;
    var eventId = req.params.eventId;

    var errors = Item.isTimeValid({ start, end });

    if (errors) {
        res.status(400).send({ error });
        return;
    }

    Item.createTime({ start, end }, eventId)
        .then(time => {
            res.status(201).send(time);
        });
});

router.post('/activity', (req, res) => {
    var { title, description } = req.body;
    var eventId = req.params.eventId;

    var errors = Item.isActivityValid({ title, description });

    if (errors) {
        res.status(400).send({ error });
        return;
    }

    Item.createActivity({ title, description }, eventId)
        .then(activity => {
            res.status(201).send(activity);
        });
});

router.post('/location', (req, res) => {
    var { street, city, state, country } = req.body;
    var eventId = req.params.eventId;

    var addressError = Address.isValid({ street, city, state, country });

    if (addressError) {
        res.status(400).send({ error: addressError });
        return;
    }

    Address.create({ street, city, state, country })
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
var express = require('express');
var router = express.Router({ mergeParams: true });
var bodyParser = require('body-parser');
var Item = require('../Domain/Item');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in items controller');
    console.log(err);
}

router.get('/', (req, res) => {
    var eventId = req.params.eventId;
    Item.find({ eventId })
        .then(events => {
            res.status(200).send(events);
        })
        .catch(err => handleError(res, req, err));
});

router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(event => {
            res.status(200).send(event);
        })
        .catch(err => handleError(res, req, err));
});

router.post('/time', (req, res) => {
    var { start, end } = req.body;
    var eventId = req.params.eventId;

    var errors = Item.isTimeValid({ start, end });

    if (errors) {
        res.status(400).send({ error });
        return;
    }

    Item.createTime({ eventId, start, end })
        .then(time => {
            res.status(201).send(time);
        })
        .catch(err => handleError(res, req, err));
});

router.post('/activity', (req, res) => {
    var { title, description } = req.body;
    var eventId = req.params.eventId;

    var errors = Item.isActivityValid({ title, description });

    if (errors) {
        res.status(400).send({ error });
        return;
    }

    Item.createActivity({ eventId, title, description })
        .then(activity => {
            res.status(201).send(activity);
        })
        .catch(err => handleError(res, req, err));
});

router.post('/location', (req, res) => {
    var { address } = req.body;
    var eventId = req.params.eventId;

    var error = Item.isLocationValid({ address });

    if (errors) {
        res.status(400).send({ error });
        return;
    }

    Item.createLocation({ eventId, address })
        .then(location => {
            res.status(201).send(location);
        })
        .catch(err => handleError(res, req, err));
});

router.delete('/:id', (req, res) => {
    Item.delete(req.params.id)
        .then(info => {
            res.status(204).send(info);
        })
        .catch(err => handleError(res, req, err));
})

module.exports = router;
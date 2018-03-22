var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Event = require('../Domain/Event');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.status(200)
        .send({ name: "lan party", id: 3 });
});

router.post('/', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var date = req.body.date;

    var event = Event.create(title, description, date);

    res.status(200).send(event);
})

module.exports = router;
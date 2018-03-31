var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Address = require('../values/Address');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in address controller');
    console.log(err);
};

router.get('/:id', (req, res) => {
    Address.findById(req.params.id)
        .then(address => {
            if (!address)
                res.status(400).send({ error: 'no address' });
            else
                res.status(200).send(address);
        })
        .catch(err => handleError(res, req, err));
});

module.exports = router;
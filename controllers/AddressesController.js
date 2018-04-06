var express = require('express');
var router = express.Router();
var Address = require('../values/Address');

router.get('/:id', (req, res) => {
    Address.findById(req.params.id)
        .then(address => {
            if (!address)
                res.status(400).send({ error: 'no address' });
            else
                res.status(200).send(address);
        })
});

module.exports = router;
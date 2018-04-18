var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var Address = require('../values/Address');
var { jwtSecret } = require('../constants');

router.use(expressJwt({
    secret: jwtSecret
}));

router.get('/:id', (req, res) => {
    Address.findById(req.params.id)
        .then(address => {
            if (!address)
                return res.status(400).send({ error: 'no address' });
            return res.status(200).send(address);
        })
});

module.exports = router;
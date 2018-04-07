var express = require('express');
var router = express.Router();
var Account = require('../domain/Account');
var { jwtSecret } = require('../constants');
var jwt = require('jwt-simple');
var moment = require('moment');

router.post('/', (req, res) => {
    var { password, username } = req.body;

    Account.login({
        password,
        username
    })
        .then(account => {
            var now = moment();
            // 7 day token
            var hourFromNow = now
                .clone()
                .add(7, 'd');

            var payload = {
                // Expiration date (unix time)
                "exp": hourFromNow.unix(),
                // The time the jwt was issued
                "iat": now.unix(),
                // Issuer
                "iss": "avocado",
                "name": account.name,
                // Subject of the token (user)
                "sub": account.id
            }

            var token = jwt.encode(payload, jwtSecret);

            return res.status(200).send(token);
        })
        .catch(error => res.status(400).send({ error }));
})

module.exports = router;
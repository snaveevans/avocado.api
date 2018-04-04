var express = require('express');
var router = express.Router();
var Account = require('../domain/Account');
var { jwtSecret } = require('../constants');
var jwt = require('jwt-simple');
var moment = require('moment');

var test = {
    // "jti": "", // unique identifer 
    // "iss": "", // issuer
    "sub": "1234567890", // subject of the token (user)
    // "aud": "", // audience
    "exp": "", // expiration date (unix time)
    "name": "John Doe",
    "iat": 1516239022 // the time the jwt was issued
}

router.post('/', (req, res) => {
    var { username, password } = req.body;

    Account.login({ username, password })
        .then(account => {
            var now = moment();
            var hourFromNow = now.clone().add(7, 'd'); // 7 day token

            var payload = {
                "iss": "avocado", // issuer
                "sub": account._id, // subject of the token (user)
                "exp": hourFromNow.unix(), // expiration date (unix time)
                "name": account.name,
                "iat": now.unix() // the time the jwt was issued
            }

            var token = jwt.encode(payload, jwtSecret);
            return res.status(200).send(token);
        }).catch(err => {
            return res.status(400)
                .send({ error: 'incorrect username or password' });
        });
})

module.exports = router;
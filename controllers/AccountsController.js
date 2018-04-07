var express = require('express');
var router = express.Router();
var Account = require('../domain/Account');

router.get('/', (req, res) => {
    Account.find({})
        .then(accounts => {
            res.status(200).send(accounts);
        })
})

// Create account
router.post('/', (req, res) => {
    var { name, password, username } = req.body;

    var error = Account.isValid({
        name,
        password,
        username
    });

    if (error)
        return res.status(400).send({ error });

    Account.create({
        name,
        password,
        username
    })
        .then(account => {
            res.status(201).send(account);
        })
});

module.exports = router;
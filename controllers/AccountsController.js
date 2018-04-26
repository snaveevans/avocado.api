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

    var isValid = Account.isValid({
        name,
        password,
        username
    });

    if (!isValid)
        return res.status(400).send();

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
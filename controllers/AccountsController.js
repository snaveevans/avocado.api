var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Account = require('../domain/Account');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in accounts controller');
    console.log(err);
}

router.get('/', (req, res) => {
    Account.find({})
        .then(accounts => {
            res.status(200).send(accounts);
        })
})

// router.delete('/:id', (req, res) => {
//     Account.delete(req.params.id)
//         .then(info => {
//             res.status(204).send();
//         })
//         .catch(err => handleError(res, req, err));
// })

// create account
router.post('/', (req, res) => {
    var { name, username, password } = req.body;

    var error = Account.isValid({ name, username, password });

    if (error) {
        res.status(400).send({ error });
        return;
    }

    Account.create({ name, username, password })
        .then(account => {
            res.status(201).send(account);
        })
});

// login
router.post('/login', (req, res) => {
    var { username, password } = req.body;

    Account.login({ username, password })
        .then(account => {
            res.status(200).send(account);
        }).catch(err => {
            res.status(400).send({ error: 'incorrect username or password' });
        });
})

module.exports = router;
var express = require('express');
var router = express.Router({ mergeParams: true });
var Role = require('../domain/Role');
var RoleAccount = require('../domain/RoleAccount');

const handleError = (req, res, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in roles controller');
    console.log(err);
}

router.get('/', (req, res) => {
    var eventId = req.params.eventId;
    Role.find({ eventId })
        .then(roles => {
            return res.status(200).send(roles);
        });
});

router.post('/guest', (req, res) => {
    var eventId = req.params.eventId;

    Role.find({ eventId })
        .then(guestRole => {
            RoleAccount.create({ role: guestRole, account })
                .then(roleAccount => {
                    res.status(201).send(roleAccount);
                });
        });
})

router.delete('/:id', (req, res) => {
    var id = req.params.id;

    RoleAccount.delete(id)
        .then(info => {
            return res.sendStatus(204);
        })
});

module.exports = router;
var express = require('express');
var router = express.Router({ mergeParams: true });
var Role = require('../domain/Role');
var RoleAccount = require('../domain/RoleAccount');

router.get('/', (req, res) => {
    var { eventId } = req.params;

    Role.find({ eventId })
        .then(roles => res.status(200).send(roles));
});

router.post('/guest', (req, res) => {
    var { eventId } = req.params;
    var { account } = req;

    Role.find({ eventId })
        .then(guestRole => {
            RoleAccount.create({
                account,
                role: guestRole
            })
                .then(roleAccount => {
                    res.status(201).send(roleAccount);
                });
        });
})

router.delete('/:id', (req, res) => {
    var { id } = req.params;

    RoleAccount.delete(id)
        .then(() => res.sendStatus(204))
});

module.exports = router;
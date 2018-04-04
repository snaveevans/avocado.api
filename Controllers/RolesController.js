var express = require('express');
var router = express.Router();
var Role = require('../domain/Role');
var RoleAccount = require('../domain/RoleAccount');

const handleError = (res, req, err) => {
    res.status(500).send({ error: 'internal error' });
    console.log('error in roles controller');
    console.log(err);
}

router.get('/', (req, res) => {
    var eventId = req.params.eventId;
    Role.find({ eventId, type: 'guest' })
        .then(guestRole => {
            RoleAccount.find({ roleId: guestRole.id })
                .then(roleAccounts => {
                    res.status(200).send(roleAccounts);
                })
                .catch(err => handleError(res, req, err));
        })
        .catch(err => handleError(res, req, err));
});

router.post('/guest', (req, res) => {
    var eventId = req.params.eventId;

    Role.find({ eventId })
        .then(guestRole => {
            RoleAccount.create({ role: guestRole, account })
                .then(roleAccount => {
                    res.status(201).send(roleAccount);
                })
                .catch(err => handleError(res, req, err));
        })
        .catch(err => handleError(res, req, err));
})

// delete 5ac468e1222775985732fc59
router.delete('/:id', (req, res) => {
    var id = req.params.id;

    RoleAccount.delete(id)
        .then(info => {
            return res.sendStatus(204);
        })
});

module.exports = router;
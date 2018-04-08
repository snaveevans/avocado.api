var express  = require('express');
var router = express.Router({ mergeParams: true });
var Promise = require("bluebird");
var Account = require('../domain/Account');
var Role = require('../domain/Role');
var RoleAccount = require('../domain/RoleAccount');

router.get('/', (req, res) => {
    var { eventId } = req.params;

    Role.find({ eventId })
        .then(roles => res.status(200).send(roles));
});

router.post('/guest/:accountId', (req, res) => {
    var { eventId, accountId } = req.params;

    var accountPromise = Account.findById(accountId);
    var rolePromise = Role.findOne({ eventId, type: 'guest' });

    Promise.all([accountPromise, rolePromise])
        .then(allData => {
            var [account, guestRole] = allData;

            if (!account || !guestRole)
                return res.status(400).send({ error: 'Self test error.'})

            guestRole.addAccount(account)
                .then(roleAccount => {
                    return res.status(201).send(roleAccount);
                });
        });
})

router.delete('/:id', (req, res) => {
    var { id } = req.params;

    RoleAccount.delete(id)
        .then(() => res.sendStatus(204))
});

module.exports = router;
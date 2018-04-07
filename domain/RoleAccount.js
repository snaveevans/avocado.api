var mongoose = require('mongoose');
var Promise = require("bluebird");

const RoleAccount = mongoose.model('roleaccount', {
    accountId: String,
    roleId: String,
    status: String
});

const create = (role, account) => {
    const roleAccount = new RoleAccount({
        accountId: account.id,
        roleId: role.id,
        status: 'Not Responded'
    });

    return roleAccount.save();
}

const hasAccess = (eventId, accountId) =>
    new Promise(resolve => {
        RoleAccount.findOne({
            accountId,
            eventId
        })
            .then(roleAccount => {
                var exists = Boolean(roleAccount);

                return resolve(!exists);
            });
    })

module.exports = {
    create,
    find: (conditions, projections, options) => RoleAccount
        .find(conditions, projections, options)
        .exec(),
    findOne: (conditions, projections, options) => RoleAccount
        .findOne(conditions, projections, options)
        .exec(),
    hasAccess
};
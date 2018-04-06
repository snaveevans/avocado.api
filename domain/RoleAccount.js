var mongoose = require('mongoose');
var validator = require('validator');
var Promise = require("bluebird");

const RoleAccount = mongoose.model('roleaccount', {
    roleId: String,
    accountId: String,
    status: String
});

const create = (role, account) => {
    const roleAccount = new RoleAccount({
        roleId: role.id,
        accountId: account.id,
        status: 'Not Responded'
    });

    return roleAccount.save();
}

const hasAccess = (eventId, accountId) => {
    return new Promise((resolve, reject) => {
        RoleAccount.findOne({ eventId, accountId })
            .then(roleAccount => {
                var exists = roleAccount !== undefined;
                return resolve(exists);
            });
    })
}

module.exports = {
    create,
    hasAccess,
    find: (conditions, projections, options) => RoleAccount.find(conditions, projections, options).exec(),
    findOne: (conditions, projections, options) => RoleAccount.findOne(conditions, projections, options).exec()
};
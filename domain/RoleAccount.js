var mongoose = require('mongoose');
var validator = require('validator');

const RoleAccount = mongoose.model('RoleAccount', {
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

module.exports = {
    create,
    find: (conditions, projections, options) => RoleAccount.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => RoleAccount.findOne({ id }, projection, options).exec(),
    delete: (id) => RoleAccount.findOne({ id }).remove()
};
var mongoose = require('mongoose');
var { Schema } = mongoose;
var uuid = require('uuid/v4');
var RoleAccount = require('./RoleAccount');
var Promise = require("bluebird");

const roleSchema = new Schema({
    eventId: String,
    id: {
        index: true,
        type: String
    },
    type: String
});

roleSchema.methods.addAccount = function (account) {
    return RoleAccount.create(this, account);
};

roleSchema.methods.hasAccount = function (account) {
    var roleId = this.id;
    var accountId = account.id;

    return new Promise(resolve => {
        RoleAccount.findOne({
            accountId,
            roleId
        })
            .then(roleAccount => resolve(roleAccount !== null));
    })
};

const Role = mongoose.model('role', roleSchema);

const create = (event, type) => {
    const role = new Role({
        eventId: event.id,
        id: uuid(),
        type
    });

    return role.save();
}

const createGuestRole = event => create(event, 'guest');

const createHostRole = event => create(event, 'host');

module.exports = {
    createGuestRole,
    createHostRole,
    delete: id => Role.findOne({ id })
        .remove(),
    find: (conditions, projections, options) => Role
        .find(conditions, projections, options)
        .exec(),
    findById: (id, projection, options) => Role
        .findOne({ id }, projection, options)
        .exec()
};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var uuid = require('uuid/v4');
var RoleAccount = require('./RoleAccount');
var Promise = require("bluebird");

const roleSchema = new Schema({
    id: { type: String, index: true },
    eventId: String,
    type: String
});

roleSchema.methods.addAccount = function (account) {
    return RoleAccount.create(this, account);
};

roleSchema.methods.hasAccount = function (account) {
    var roleId = this.id;
    var accountId = account.id;
    return new Promise((resolve, reject) => {
        RoleAccount.findOne({ roleId, accountId })
            .then(roleAccount => {
                return resolve(roleAccount != null);
            });
    })
};

const Role = mongoose.model('role', roleSchema);

const createGuestRole = event => {
    return create(event, 'guest');
}

const createHostRole = event => {
    return create(event, 'host');
}

const create = (event, type) => {
    const role = new Role({
        id: uuid(),
        eventId: event.id,
        type
    });

    return role.save();
}

module.exports = {
    createGuestRole,
    createHostRole,
    find: (conditions, projections, options) => Role.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Role.findOne({ id }, projection, options).exec(),
    delete: (id) => Role.findOne({ id }).remove()
};
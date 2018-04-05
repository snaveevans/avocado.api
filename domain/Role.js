var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var uuid = require('uuid/v4');
var RoleAccount = require('./RoleAccount');

const roleSchema = new Schema({
    id: { type: String, index: true },
    eventId: String,
    type: String
});

roleSchema.methods.addAccount = function (account) {
    return RoleAccount.create(this, account);
};

const Role = mongoose.model('Role', roleSchema);

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
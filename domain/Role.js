var mongoose = require('mongoose');
var validator = require('validator');

const Role = mongoose.model('Role', {
    type: String
});

const createGuestRole = () => {
    return create('guest');
}

const createHostRole = () => {
    return create('host');
}

const create = (type) => {
    const role = new Role({
        type
    });

    return role.save();
}

module.exports = {
    createGuestRole,
    createHostRole,
    find: (conditions, projections, options) => Role.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Role.findById(id, projection, options).exec(),
    delete: (id) => Role.findById(id).remove()
};
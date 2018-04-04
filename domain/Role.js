var mongoose = require('mongoose');
var validator = require('validator');

const Role = mongoose.model('Role', {
    eventId: String,
    type: String
});

const createGuestRole = event => {
    return create(event, 'guest');
}

const createHostRole = event => {
    return create(event, 'host');
}

const create = (event, type) => {
    const role = new Role({
        eventId: event._id,
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
var mongoose = require('mongoose');
var validator = require('validator');

const Address = mongoose.model('Address', {
    type: String,
    street: String,
    city: String,
    state: String,
    country: String
});

const create = ({street, city, state, country}) => {
    const address = new Address({
        type: 'street',
        street,
        city,
        state,
        country
    });

    return address.save();
}

const isValid = ({street, city, state, country}) => {
    if (street == null || validator.isEmpty(street))
        return 'street must have a value';
    if (city == null || validator.isEmpty(city))
        return 'city must have a value';
    if (state == null || validator.isEmpty(state))
        return 'state must have a value';
    if (country == null || validator.isEmpty(country))
        return 'country must have a value';
}

module.exports = {
    create,
    isValid,
    find: (conditions, projections, options) => Address.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Address.findById(id, projection, options).exec(),
    delete: (id) => Address.findById(id).remove()
};
var mongoose = require('mongoose');
var { Schema } = mongoose;
var validator = require('validator');
var uuid = require('uuid/v4');

const addressSchema = new Schema({
    city: String,
    country: String,
    id: {
        index: true,
        type: String
    },
    state: String,
    street: String,
    type: String
});

const Address = mongoose.model('Address', addressSchema);

const create = ({ city, country, state, street }) => {
    const address = new Address({
        city,
        country,
        id: uuid(),
        state,
        street,
        type: 'street'
    });

    return address.save();
}

const isValid = ({ city, country, state, street }) => {
    if (!street || validator.isEmpty(street))
        return false;
    // return 'street must have a value';
    if (!city || validator.isEmpty(city))
        return false;
    // return 'city must have a value';
    if (!state || validator.isEmpty(state))
        return false;
    // return 'state must have a value';
    if (!country || validator.isEmpty(country))
        return false;
    // return 'country must have a value';
}

module.exports = {
    create,
    delete: id => Address.findOne({ id }).remove(),
    find: (conditions, projections, options) => Address
        .find(conditions, projections, options)
        .exec(),
    findById: (id, projection, options) => Address
        .findOne({ id }, projection, options)
        .exec(),
    isValid
};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var uuid = require('uuid/v4');

const addressSchema = new Schema({
    id: { type: String, index: true },
    type: String,
    street: String,
    city: String,
    state: String,
    country: String
});

const Address = mongoose.model('Address', addressSchema);

const create = ({street, city, state, country}) => {
    const address = new Address({
        id: uuid(),
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
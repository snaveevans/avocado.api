var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validator = require('validator');
var uuid = require('uuid/v4');
const dateFormat = 'YYYY-MM-DDTHH:mm:ss Z';

const itemSchema = new Schema({
    id: { type: String, index: true },
    type: String,
    eventId: String,
    start: Date,
    end: Date,
    created: String,
    title: String,
    description: String,
    addressId: String
});

const Item = mongoose.model('item', itemSchema);

const createTime = ({ start, end }, eventId) => {
    var startActual = moment(start, dateFormat, true);
    var endActual = moment(end, dateFormat, true);

    const item = new Item({
        id: uuid(),
        type: 'time',
        eventId,
        start: startActual.utc().toDate(),
        end: endActual.utc().toDate()
    });

    return item.save();
}

const isTimeValid = ({ start, end }) => {
    if (start == null || validator.isEmpty(start))
        return 'start must have a value';
    if (end == null || validator.isEmpty(end))
        return 'end must have a value';

    var startActual = moment(start, dateFormat, true);

    if (!startActual.isValid())
        return 'start is not a valid date'

    var endActual = moment(end, dateFormat, true);
    if (!endActual.isValid())
        return 'start is not a valid date'
}

const createActivity = ({ title, description }, eventId) => {
    const item = new Item({
        id: uuid(),
        type: 'activity',
        eventId,
        title,
        description
    });

    return item.save();
}

const isActivityValid = ({ title, description }) => {
    if (title == null || validator.isEmpty(title))
        return 'title must have a value';
    if (description == null || validator.isEmpty(description))
        return 'description must have a value';
}

const createLocation = (address, eventId) => {
    const item = new Item({
        id: uuid(),
        type: 'location',
        eventId,
        addressId: address.id
    });

    return item.save();
}

const isLocationValid = ({ address }) => {
    if (address == null)
        return 'address must have a value';
    if (address._id == null || validator.isEmpty(address._id))
        return "address doesn't have an id";
}

module.exports = {
    createTime,
    isTimeValid,
    createActivity,
    isActivityValid,
    createLocation,
    isLocationValid,
    find: (conditions, projections, options) => Item.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Item.findOne({ id }, projection, options).exec(),
    delete: (id) => Item.findOne({ id }).remove()
}
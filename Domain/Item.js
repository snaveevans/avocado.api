var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');

const Item = mongoose.model('Item', {
    type: String,
    eventId: String,
    start: String,
    end: String,
    created: String,
    title: String,
    description: String
});

const createTime = ({ eventId, start, end }) => {
    var startActual = moment(start, 'YYYY-MM-DDTHH:mm:ss Z', true);
    var endActual = moment(end, 'YYYY-MM-DDTHH:mm:ss Z', true);

    const item = new Item({
        type: 'Time',
        eventId,
        start: startActual.utc().format(),
        end: endActual.utc().format()
    });

    return item.save();
}

const isTimeValid = ({ start, end }) => {
    if (start == null || validator.isEmpty(start))
        return 'start must have a value';
    if (end == null || validator.isEmpty(end))
        return 'end must have a value';

    var startActual = moment(start, 'YYYY-MM-DDTHH:mm:ss Z', true);

    if (!startActual.isValid())
        return 'start is not a valid date'

    var endActual = moment(end, 'YYYY-MM-DDTHH:mm:ss Z', true);
    if (!endActual.isValid())
        return 'start is not a valid date'
}

const createActivity = ({ eventId, title, description }) => {
    const item = new Item({
        type: 'Activity',
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

const createLocation = ({ eventId, address }) => {
    const item = new Item({
        type: 'Location',
        eventId,
        address
    });

    return item.save();
}

const isLocationValid = ({ address }) => {
    if (address == null || validator.isEmpty(address))
        return 'address must have a value';
}

module.exports = {
    createTime,
    isTimeValid,
    createActivity,
    isActivityValid,
    createLocation,
    isLocationValid,
    find: (conditions, projections, options) => Item.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Item.findById(id, projection, options).exec(),
    delete: (id) => Item.findById(id).remove()
}
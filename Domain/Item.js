var mongoose = require('mongoose');
var { Schema } = mongoose;
var moment = require('moment');
var { isNullOrEmpty, isNullOrUndefined } = require('../validator');
var uuid = require('uuid/v4');
const dateFormat = 'YYYY-MM-DDTHH:mm:ss Z';

const itemSchema = new Schema({
    addressId: String,
    created: String,
    description: String,
    end: Date,
    eventId: String,
    id: {
        index: true,
        type: String
    },
    start: Date,
    title: String,
    type: String,
    votes: [String]
});

itemSchema.methods.addVote = function (account) {
    if (this.votes.filter(vote => vote === account.id)
        .length === 0)
        this.votes.push(account.id);

    return this;
}

itemSchema.methods.removeVote = function (account) {
    var index = this.votes.indexOf(account.id);

    if (index !== -1)
        this.votes.splice(index, 1);
    return this;
}

const Item = mongoose.model('item', itemSchema);

const createTime = ({ start, end }, eventId) => {
    var startActual = moment(start, dateFormat, true);
    var endActual = moment(end, dateFormat, true);

    const item = new Item({
        end: endActual
            .utc()
            .toDate(),
        eventId,
        id: uuid(),
        start: startActual
            .utc()
            .toDate(),
        type: 'time'
    });

    return item.save();
}

const isTimeValid = ({ start, end }) => {
    if (isNullOrEmpty(start))
        return 'start must have a value';
    if (isNullOrEmpty(end))
        return 'end must have a value';
    var startActual = moment(start, dateFormat, true);

    if (!startActual.isValid())
        return 'start is not a valid date'
    var endActual = moment(end, dateFormat, true);

    if (!endActual.isValid())
        return 'start is not a valid date'
}

const createActivity = ({ description, title }, eventId) => {
    const item = new Item({
        description,
        eventId,
        id: uuid(),
        title,
        type: 'activity'
    });

    return item.save();
}

const isActivityValid = ({ description, title }) => {
    if (isNullOrEmpty(title))
        return 'title must have a value';
    if (isNullOrEmpty(description))
        return 'description must have a value';
}

const createLocation = (address, eventId) => {
    const item = new Item({
        addressId: address.id,
        eventId,
        id: uuid(),
        type: 'location'
    });

    return item.save();
}

const isLocationValid = ({ address }) => {
    if (isNullOrUndefined(address))
        return 'address must have a value';
    if (isNullOrEmpty(address.id))
        return "address doesn't have an id";
}

module.exports = {
    createActivity,
    createLocation,
    createTime,
    delete: id => Item.findOne({ id })
        .remove(),
    find: (conditions, projections, options) => Item
        .find(conditions, projections, options)
        .exec(),
    findById: (id, projection, options) => Item
        .findOne({ id }, projection, options)
        .exec(),
    isActivityValid,
    isLocationValid,
    isTimeValid
}
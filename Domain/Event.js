var mongoose = require('mongoose');
var { Schema } = mongoose;
var moment = require('moment');
var Role = require('./Role');
var RoleAccount = require('./RoleAccount');
var uuid = require('uuid/v4');
//  2018-03-22T18:45:29.744Z
const dateFormat = 'YYYY-MM-DDTHH:mm:ss Z';
var Promise = require("bluebird");
var { isNullOrEmpty } = require('../validator');

const eventSchema = new Schema({
    created: Date,
    date: Date,
    description: String,
    id: {
        index: true,
        type: String
    },
    title: String
});

eventSchema.methods.addGuest = function (account) {
    return new Promise(resolve => {
        var eventId = this.id;
        var conditions = {
            eventId,
            type: 'guest'
        };

        Role.findOne(conditions)
            .then(guestRole => {
                guestRole.addAccount(account)
                    .then(roleAccount => resolve(roleAccount));
            });
    })
};

eventSchema.methods.hasAccess = function (account) {
    return new Promise(resolve => {
        var eventId = this.id;

        Role.find({ eventId })
            .then(roles => {
                var rolePromises = roles
                    .map(role => role.hasAccount(account));

                Promise.all(rolePromises)
                    .then(results => {
                        var hasRoleAccount = results
                            .filter(item => item === true)
                            .length > 0;

                        return resolve(hasRoleAccount);
                    });
            });
    })
};

const Event = mongoose.model('event', eventSchema);

const create = ({ title, description, date }, account) =>
    new Promise(resolve => {
        var dateActual = moment(date, dateFormat, true);

        const event = new Event({
            created: moment()
                .utc()
                .toDate(),
            date: dateActual
                .utc()
                .toDate(),
            description,
            id: uuid(),
            title
        });

        event.save()
            .then(savedEvent => {
                var hostRolePromise = Role.createHostRole(savedEvent);
                var guestRolePromise = Role.createGuestRole(savedEvent);

                Promise.all([hostRolePromise, guestRolePromise])
                    .then(allData => {
                        var [hostRole] = allData;

                        hostRole.addAccount(account)
                            .then(() => resolve(savedEvent));
                    });
            });
    })

const isValid = ({ title, description, date }) => {
    if (isNullOrEmpty(title))
        return 'title must have a value';
    if (isNullOrEmpty(description))
        return 'description must have a value';
    if (isNullOrEmpty(date))
        return 'date must have a value';

    var dateActual = moment(date, dateFormat, true);

    if (!dateActual.isValid())
        return 'date is not a valid date';
}

const getAllEvents = account =>
    new Promise(resolve => {
        RoleAccount.find({ accountId: account.id })
            .then(roleAccounts => {
                var roleIds = roleAccounts
                    .map(roleAccount => roleAccount.roleId);

                Role.find({ "id": { $in: roleIds } })
                    .then(roles => {
                        var eventIds = roles.map(role => role.eventId);

                        Event.find({ "id": { $in: eventIds } }).exec()
                            .then(events => resolve(events));
                    });
            });
    });

module.exports = {
    create,
    delete: id => Event.findOne({ id })
        .remove(),
    find: (conditions, projections, options) => Event
        .find(conditions, projections, options)
        .exec(),
    findById: (id, projection, options) => Event
        .findOne({ id }, projection, options)
        .exec(),
    getAllEvents,
    isValid
};
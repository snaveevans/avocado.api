var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validator = require('validator');
var Role = require('./Role');
var RoleAccount = require('./RoleAccount');
var uuid = require('uuid/v4');
//  2018-03-22T18:45:29.744Z
const dateFormat = 'YYYY-MM-DDTHH:mm:ss Z';
var Promise = require("bluebird");

const eventSchema = new Schema({
    id: { type: String, index: true },
    title: String,
    description: String,
    date: Date,
    created: Date
});

eventSchema.methods.addGuest = function (account) {
    return new Promise((resolve, reject) => {
        var eventId = this.id;
        Role.findOne({ eventId, type: 'guest' })
            .then(guestRole => {
                guestRole.addAccount(account)
                    .then(roleAccount => {
                        return resolve(roleAccount);
                    });
            });
    })
};

eventSchema.methods.hasAccess = function (account) {
    return new Promise((resolve, reject) => {
        var eventId = this.id;
        Role.find({ eventId })
            .then(roles => {
                var rolePromises = roles.map(role => {
                    return role.hasAccount(account);
                });
                Promise.all(rolePromises)
                    .then(results => {
                        var hasAccess = results.filter(hasAccess => hasAccess === true).length > 0;
                        return resolve(hasAccess);
                    });
            });
    })
};

const Event = mongoose.model('event', eventSchema);

const create = ({ title, description, date }, account) => {
    return new Promise((resolve, reject) => {
        var dateActual = moment(date, dateFormat, true);

        const event = new Event({
            id: uuid(),
            title,
            description,
            date: dateActual.utc().toDate(),
            created: moment().utc().toDate()
        });

        event.save()
            .then(savedEvent => {
                var hostRolePromise = Role.createHostRole(savedEvent);
                var guestRolePromise = Role.createGuestRole(savedEvent);
                Promise.all([hostRolePromise, guestRolePromise])
                    .then(allData => {
                        var hostRole = allData[0];
                        hostRole.addAccount(account)
                            .then(roleAccount => {
                                return resolve(savedEvent);
                            });
                    });
            });
    })
}

const isValid = ({ title, description, date }) => {
    if (title == null || validator.isEmpty(title))
        return 'title must have a value';
    if (description == null || validator.isEmpty(description))
        return 'description must have a value';
    if (date == null || validator.isEmpty(date))
        return 'date must have a value';

    var dateActual = moment(date, dateFormat, true);
    if (!dateActual.isValid())
        return 'date is not a valid date';
}

const getAllEvents = account => {
    return new Promise((resolve, reject) => {
        RoleAccount.find({ accountId: account.id })
            .then(roleAccounts => {
                var roleIds = roleAccounts.map(i => i.roleId);
                Role.find({ "id": { $in: roleIds } })
                    .then(roles => {
                        var eventIds = roles.map(i => i.eventId);
                        Event.find({ "id": { $in: eventIds } }).exec()
                            .then(events => {
                                return resolve(events);
                            });
                    });
            });
    });
}

module.exports = {
    create,
    isValid,
    getAllEvents,
    find: (conditions, projections, options) => Event.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Event.findOne({ id }, projection, options).exec(),
    delete: (id) => Event.findOne({ id }).remove()
};
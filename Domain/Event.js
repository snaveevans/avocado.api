var mongoose = require('mongoose');
var moment = require('moment');
var validator = require('validator');
var Role = require('./Role');
var RoleAccount = require('./RoleAccount');

const Event = mongoose.model('Event', {
    title: String,
    description: String,
    date: String,
    created: String
});

const create = ({ title, description, date }, account) => {
    return new Promise((resolve, reject) => {
        var dateActual = moment(date, 'YYYY-MM-DDTHH:mm:ss Z', true);

        const event = new Event({
            title,
            description,
            date: dateActual.utc().format(),
            created: moment().utc().format()
        });

        event.save()
            .then(event => {
                var hostRolePromise = Role.createHostRole(event);
                var guestRolePromise = Role.createGuestRole(event);
                Promise.all([hostRolePromise, guestRolePromise])
                    .then(allData => {
                        var hostRole = allData[0];
                        RoleAccount.create({ role: hostRole, account })
                            .then(roleAccount => {
                                return resolve(event);
                            }).catch(err => { return reject(err) });
                    }).catch(err => { return reject(err) });
            }).catch(err => { return reject(err) });
    })
}

const isValid = ({ title, description, date }) => {
    if (title == null || validator.isEmpty(title))
        return 'title must have a value';

    if (description == null || validator.isEmpty(description))
        return 'description must have a value';

    if (date == null || validator.isEmpty(date))
        return 'date must have a value';

    //  2018-03-22T18:45:29.744Z
    var dateActual = moment(date, 'YYYY-MM-DDTHH:mm:ss Z', true);
    if (!dateActual.isValid())
        return 'date is not a valid date';
}

module.exports = {
    create,
    isValid,
    find: (conditions, projections, options) => Event.find(conditions, projections, options).exec(),
    findById: (id, projection, options) => Event.findById(id, projection, options).exec(),
    delete: (id) => Event.findById(id).remove()
};
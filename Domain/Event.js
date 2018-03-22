const uuidv4 = require('uuid/v4');
var moment = require('moment');
var validator = require('validator');

var events = [
    {
        id: "98108017-d464-40d7-beb4-5a68372ac779",
        title: 'Lan Party',
        description: 'Come play Siege & PUBG!',
        date: moment('2018-03-19T18:30:00 -0700', 'YYYY-MM-DDTHH:mm:ss Z', true).utc(),
        created: moment()
    }, {
        id: "2ed8fa97-9cfd-4a1a-b250-313ccb561f39",
        title: 'Star Wars Solo',
        description: 'Lets go watch Han Solo',
        date: moment('2018-06-06T20:00:00 -0700', 'YYYY-MM-DDTHH:mm:ss Z', true).utc(),
        created: moment()
    }, {
        id: "e019e7c0-f6a2-4479-8b6d-e332b03bc296",
        title: 'Avocado Release',
        description: 'Finally the release of the long awaited project Avocado!',
        date: moment('2030-03-19T18:30:00 -0700', 'YYYY-MM-DDTHH:mm:ss Z', true).utc(),
        created: moment()
    }
]

function create({ title, description, date }) {
    return new Promise((resolve, reject) => {
        var dateActual = moment(date, 'YYYY-MM-DDTHH:mm:ss Z', true);

        var event = {
            id: uuidv4(),
            title,
            description,
            date: dateActual.utc(),
            created: moment()
        };

        events.push(event);
        resolve(event);
    });
}

function getErrors({ title, description, date }) {
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

function find() {
    return new Promise((resolve, reject) => {
        resolve(events);
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        var event = events.find(function (element) {
            return element.id === id;
        });

        resolve(event);
    });
}

module.exports = {
    create,
    getErrors,
    find,
    findById
};
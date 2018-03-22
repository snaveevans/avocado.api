const uuidv4 = require('uuid/v4');
var moment = require('moment');

function create(title, description, date) {
    return {
        id: uuidv4(),
        title,
        description,
        date,
        created: moment()
    }
}

module.exports = {
    create
};
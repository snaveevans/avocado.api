var mongoose = require('mongoose');
var Promise = require('bluebird');

const initialize = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/avocado');
    mongoose.Promise = Promise;
}

module.exports = {
    initialize
}
var validator = require('validator');

const isNullOrUndefined = obj => !obj;

const isNullOrEmpty = string => isNullOrUndefined(string) ||
    validator.isEmpty(string);

module.exports = {
    isNullOrEmpty,
    isNullOrUndefined
};
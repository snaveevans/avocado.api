var mongoose = require('mongoose');
var { Schema } = mongoose;
var bcrypt = require('bcrypt');
var moment = require('moment');
var uuid = require('uuid/v4');
var Promise = require('bluebird');
var { isNullOrEmpty } = require('../validator');

const accountSchema = new Schema({
    date: Date,
    id: {
        index: true,
        type: String
    },
    isEnabled: Boolean,
    name: String,
    password: String,
    username: String
});

const Account = mongoose.model('account', accountSchema);

const sanitize = account => ({
    id: account.id,
    name: account.name,
    username: account.username
});

const create = ({ name, password, username }) =>
    new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                return reject(err);

            const account = new Account({
                date: moment()
                    .utc()
                    .toDate(),
                id: uuid(),
                isEnabled: true,
                name,
                password: hash,
                username
            });

            account.save()
                .then(savedAccount => resolve(sanitize(savedAccount)));
        }));

const isValid = ({ name, username, password }) => {
    if (isNullOrEmpty(name))
        return false;
    // return 'name must have a value';
    if (isNullOrEmpty(username))
        return false;
    // return 'username must have a value';
    if (isNullOrEmpty(password))
        return false;
    // return 'password must have a value';
    if (password.length < 10)
        return false;
    // return 'password must be at least 10';
}

const login = ({ password, username }) =>
    new Promise((resolve, reject) => {
        Account.find({ username }).exec()
            .then(accounts => {
                if (accounts.length !== 1)
                    return reject(new Error('username or password incorrect'));
                var [account] = accounts;

                bcrypt.compare(password, account.password, (err, res) => {
                    if (err)
                        return reject(err);
                    if (res) {
                        return resolve(sanitize(account));
                    }
                    return reject(new Error('username or password incorrect'));
                });
            });
    });

const find = (conditions, projections, options) =>
    new Promise(resolve => {
        Account.find(conditions, projections, options)
            .exec()
            .then(accounts => {
                var sanitized = accounts.map(sanitize);

                return resolve(sanitized);
            });
    });

const findById = (id, projection, options) =>
    new Promise(resolve => {
        Account.findOne({ id }, projection, options)
            .exec()
            .then(account => resolve(sanitize(account)));
    })

module.exports = {
    create,
    delete: id => Account.findOne({ id }).remove(),
    find,
    findById,
    isValid,
    login
};
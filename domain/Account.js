var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var moment = require('moment');
var uuid = require('uuid/v4');

const Account = mongoose.model('Account', {
    id: { type: String, index: true },
    name: String,
    username: String,
    password: String,
    date: Date,
    isEnabled: Boolean
});

const create = ({ name, username, password }) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                return reject(err);

            const account = new Account({
                name,
                username,
                password: hash,
                date: moment().utc().toDate(),
                isEnabled: true
            });

            account.save()
                .then(savedAccount => {
                    return resolve(sanitize(savedAccount));
                }).catch(err => { return resolve(err); })
        });
    });
}

const isValid = ({ name, username, password }) => {
    if (name == null || validator.isEmpty(name))
        return 'name must have a value';
    if (username == null || validator.isEmpty(username))
        return 'username must have a value';
    if (password == null || validator.isEmpty(password))
        return 'password must have a value';
    if (password.length < 10)
        return 'password must be at least 10';
}

const login = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        Account.find({ username }).exec()
            .then(accounts => {
                if (accounts.length !== 1)
                    return reject();

                var account = accounts[0];
                bcrypt.compare(password, account.password, (err, res) => {
                    if (res) {
                        return resolve(sanitize(account));
                    } else {
                        return reject();
                    }
                });
            });
    })
}

const sanitize = account => {
    return {
        id: account.id,
        name: account.name,
        username: account.username
    };
}

const find = (conditions, projections, options) => {
    return new Promise((resolve, reject) => {
        Account.find(conditions, projections, options)
            .exec()
            .then(accounts => {
                var sanitized = accounts.map(sanitize);
                return resolve(sanitized);
            }).catch(err => {
                return reject(err);
            });
    });
}

const findById = (id, projection, options) => {
    return new Promise((resolve, reject) => {
        Account.findOne({ id }, projection, options)
            .exec()
            .then(account => {
                return resolve(sanitize(account));
            })
            .catch(err => {
                return reject(err);
            })
    })
}

module.exports = {
    create,
    isValid,
    login,
    find,
    findById,
    delete: (id) => Account.findOne({ id }).remove()
};
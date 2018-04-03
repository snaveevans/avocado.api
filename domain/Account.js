var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
const saltRounds = 10;

const Account = mongoose.model('Account', {
    name: String,
    username: String,
    password: String
});

const create = ({ name, username, password }) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
                return;
            }

            const account = new Account({
                name,
                username,
                password: hash
            });

            account.save();

            resolve(sanitize(account));
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
                if (accounts.length !== 1) {
                    reject();
                    return;
                }

                var account = accounts[0];
                bcrypt.compare(password, account.password, function (err, res) {
                    if (res) {
                        delete account.password;
                        resolve(sanitize(account));
                    } else {
                        reject();
                    }
                });
            });
    })
}

const sanitize = account => {
    return {
        _id: account._id,
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
                resolve(sanitized);
            }).catch(err => {
                reject(err);
            });
    });
}

const findById = (id, projection, options) => {
    return new Promise((resolve, reject) => {
        Account.findById(id, projection, options)
            .exec()
            .then(account => {
                resolve(sanitize(account));
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    create,
    isValid,
    login,
    find,
    findById,
    delete: (id) => Account.findById(id).remove()
};
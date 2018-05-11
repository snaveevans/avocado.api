var expressJwt = require('express-jwt');
var { jwtSecret } = require('./constants');
var Event = require('./domain/Event');
var Account = require('./domain/Account');

const authorizeEvent = () => {
    return (req, res, next) => {
        var { path } = req;
    
        if (path === '/') {
            return next();
        }
        var sections = path.split('/');
    
        if (sections.length >= 2) {
            var [, eventId] = sections;
    
            if (!req.account)
                return res.sendStatus(401);
    
            Event.findById(eventId)
                .then(event => {
                    if (!event)
                        return res.sendStatus(401);
    
                    event.hasAccess(req.account)
                        .then(hasAccess => {
                            if (hasAccess) {
                                req.event = event;
                                return next();
                            }
                            return res.sendStatus(401);
                        })
                })
        }
        else
            return next();
    }
}

const appendAccount = () => {
    return (req, res, next) => {
        if (req.user && req.user.sub) {
            Account.findById(req.user.sub)
                .then(account => {
                    if (account) {
                        req.account = account;
                    }
                    return next();
                })
        }
        else
            return next();
    }
}

const authorize = () => {
    return expressJwt({
        secret: jwtSecret
    })
}

module.exports = {
    authorizeEvent,
    authorize,
    appendAccount
};
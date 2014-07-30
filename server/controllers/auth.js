var passport = require('passport');
//var mongoose = require('mongoose');
//var User = mongoose.model('User');
//var Pick = mongoose.model('Pick');
//var Game = mongoose.model('Game');
//var encrypt = require('../utilities/encryption');

exports.authenticate = function(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.send({success: false})
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send({success: true, user: user});
        })
    });
    auth(req, res, next);
};

exports.logout = function(req, res) {
    req.logout();
    res.end();
};

exports.isAuthenticated = function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};

exports.isAdmin = function(role) {
    return function (req, res, next) {
        if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    }
};



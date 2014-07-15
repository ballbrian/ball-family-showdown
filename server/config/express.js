var express = require('express');
var http = require('http');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

module.exports = function(app, config) {
    // view engine setup
    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(session({secret: 'bball',
                    saveUninitialized: true,
                    resave: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.rootPath + '/public'));
    app.use(app.router);

    console.log('ballshowdown running on ' + config.enviroment);

}

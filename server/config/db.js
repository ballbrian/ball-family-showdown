var mongoose = require('mongoose');
var crypto = require('crypto');
var encrypt = require('../utilities/encryption');
var schedule = require('node-schedule');

var userModel = require('../model/user'),
    teamsModel = require('../model/teams'),
    picksModel = require('../model/picks'),
    weeksModel = require('../model/weeks');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('ballshowdown db opened');
    });

//    userModel.createDefaultUsers();

    teamsModel.createTeams();
    setTimeout(function() {
        weeksModel.createWeeksAndGames();
    }, 5000);

//    var rule = new schedule.RecurrenceRule();

//    schedule.scheduleJob(rule, function() {
    schedule.scheduleJob("*/15	19,20,21,22	* * 4,5,6", function() {
        RunUpdate();
    })

    RunUpdate();

}

var RunUpdate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    weeksModel.updateGames(today);

    today = mm+'/'+dd+'/'+yyyy + " - " + hh+":"+mm+":"+ss;

    console.log('Job Ran: ' + today);
}

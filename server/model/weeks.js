var mongoose = require('mongoose');
var gameModel = require('./games');
var request = require('request');

var weekSchema = mongoose.Schema({
    week: String,
    start: Date,
    completed: Boolean
});

var Week = mongoose.model('Week', weekSchema);



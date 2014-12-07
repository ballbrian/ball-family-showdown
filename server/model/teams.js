var mongoose = require('mongoose');
var request = require('request');

var teamSchema = mongoose.Schema({
    id: String,
    city: String,
    name: String
});

var Team = mongoose.model('Team', teamSchema);

//var api_key = "xfw4ebcua3pe2tvgwkfhxwyc";



var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    id: String,
    week: String,
    game: Number,
    scheduled: Date,
    homeTeam: String,
    awayTeam: String,
    stadium: String,
    city: String,
    state: String,
    field: String,
    type: String
});

var Game = mongoose.model('Game', gameSchema);

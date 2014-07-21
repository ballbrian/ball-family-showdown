var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    id: String,
    week: String,
    game: Number,
    scheduled: Date,
    homeTeam: String,
    awayTeam: String
});

var Game = mongoose.model('Game', gameSchema);

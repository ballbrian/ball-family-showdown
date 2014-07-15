var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    id: String,
    week: String,
    homeTeam: String,
    awayTeam: String
});

exports.getGameModel = mongoose.model('Game', gameSchema);

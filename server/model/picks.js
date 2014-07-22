var mongoose = require('mongoose');

var picksSchema = mongoose.Schema({
    user: String,
    week: String,
    game: String,
    teams: [String],
    scheduled: Date,
    pick: String,
    stadium: String,
    city: String,
    state: String,
    field: String,
    type: String
});

var Picks = mongoose.model('Pick', picksSchema);



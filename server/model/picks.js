var mongoose = require('mongoose');

var picksSchema = mongoose.Schema({
    user: String,
    points: Number,
    week: String,
    game: String,
    scores: [Number],
    teams: [String],
    scheduled: Date,
    pick: String,
    stadium: String,
    city: String,
    state: String,
    field: String,
    type: String,
    status: String,
    calculated: Boolean
});

var Picks = mongoose.model('Pick', picksSchema);



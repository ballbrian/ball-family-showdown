var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    season: String
});

mongoose.model('AdminOption', adminSchema);

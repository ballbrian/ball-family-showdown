var mongoose = require('mongoose');
var encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    firstName : {type: String, required: "{PATH} is required"},
    lastName : {type: String, required: "{PATH} is required"},
    username : {
        type: String,
        required: "{PATH} is required",
        unique: true
    },
    salt: {type: String, required: "{PATH} is required"},
    password: {type: String, required: "{PATH} is required"},
    roles: [String]
});
userSchema.methods = {
    authenticate: function(passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.password;
    },
    hasRole: function(role) {
        return this.roles.indexOf(role) > 1;
    }
}
var User = mongoose.model('User', userSchema);

exports.createDefaultUsers = function() {
    User.find({}).exec(function(err, collection) {
        if(collection.length === 0)
        {
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'bball');
            User.create({
                firstName: "Brian",
                lastName : "Ball",
                username : "bball",
                salt : salt,
                password: hash,
                roles: ['admin']
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'test');
            User.create({
                firstName: "Test",
                lastName : "User",
                username : "test",
                salt : salt,
                password: hash
            });
        }
    })
}

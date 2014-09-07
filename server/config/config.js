var path = require('path');
var rootPath = path.normalize(__dirname + "/../../");

module.exports = {
    development: {
        enviroment: "Development",
        db: 'mongodb://localhost/ballshowdown',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        enviroment: "Production",
        rootPath: rootPath,
        db: 'mongodb://bball:Audrina21@ds035310.mongolab.com:35310/ballfamilyshowdown',
        port: process.env.PORT || 3030
    }
}

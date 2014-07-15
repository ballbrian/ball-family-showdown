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
        db: 'mongodb://bball:Audrina21@ds055699.mongolab.com:55699/ballfamilyshowdown',
        port: process.env.PORT || 80
    }
}

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
        db: 'mongodb://localhost/ballshowdown',
        port: process.env.PORT || 80
    }
}

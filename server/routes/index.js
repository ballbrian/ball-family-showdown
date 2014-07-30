module.exports = function (app) {
    require('./partials') (app);
    require('./standings') (app);
    require('./picks') (app);
    require('./auth') (app);
    require('./user') (app);
    require('./main') (app);
}

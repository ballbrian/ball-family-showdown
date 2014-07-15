module.exports = function (app) {
    require('./partials') (app);
    require('./picks') (app);
    require('./auth') (app);
    require('./main') (app);
}

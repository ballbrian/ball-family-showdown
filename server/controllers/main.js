exports.index = function(req, res) {
    console.log("hi");
    res.render('index', {
        user : req.user
    });
}

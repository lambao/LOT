function Login() {

};

Login.prototype.login = function(req, res) {
    req.session.username = req.body.username;
    res.redirect('/game');
};

Login.prototype.afterLogin = function(req, res) {
    if (req.session.username) {
        res.render('gameIndex', { username: req.session.username});
    }
    else {
        res.redirect("/");
    }
}

module.exports.login = Login.prototype.login;
module.exports.afterLogin = Login.prototype.afterLogin;

//
//var Login = function() {
//
//    var login = function(req, res) {
//        req.session.username = req.body.username;
//        res.redirect('/game');
//    };
//
//    var afterLogin = function(req, res) {
//        if (req.session.username) {
//            res.render('gameIndex', { username: req.session.username});
//        }
//        else {
//            res.redirect("/");
//        }
//    };
//
//    return {
//        login: login,
//        afterLogin: afterLogin
//    }
//};
//
//module.exports = Login;
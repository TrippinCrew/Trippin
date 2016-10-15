module.exports = function(app, passport) {



    //DB Stuff
    var User = require('./models/users');
    var ObjectId = require('mongoose').Types.ObjectId;

    var isDevelopment = true;
    // ****************** GETS START ******************** 

    app.get('/', function(req, res) {
        res.render('welcome');
    });

    app.get('/swippin', function(req, res) {
        if (true) {
            res.render('swippin');
        } else {
            var user = req.user.facebook;
            res.render('swippin', { user: user });
        }
    });

    app.get('/preference', function(req, res) {
            res.render('preference');
    });

    app.get('/recommendation', function(req, res) {
            res.render('recommendation');
    });

    app.get('/facebook', function(req, res) {
        res.render('facebook');
    });

    app.get('/success', function(req, res) {
        var user = req.user.facebook;
        res.render('success', { user: user });
    });

    app.get('/failed', function(req, res) {
        res.render('failed');
    });

    app.get('/testCallAPI', function(req, res) {
        res.render('testCallAPI');
    });

    app.get('/flights', function(req, res) {
        res.render('flights');
    });


    app.get('/flights_select', function(req, res) {
        res.render('flights_select');
    });

    app.get('/profile', function(req,res){
        res.render('profile');
    });

    app.get('/hotel', function(req, res){
        res.render('hotel');
    });

    app.get('/complete', function(req, res){
        res.render('complete');
    });

    // ****************** GETS END ******************** 

    // ****************** POST START ******************** 
    // ****************** POST End ******************** 



    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

    // handle the callback after facebook has authenticated the user (SIGNUP)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/swippin',
        failureRedirect: '/failed'
    }));

};

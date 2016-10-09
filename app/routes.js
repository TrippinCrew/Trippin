module.exports = function(app, passport) {



    //DB Stuff
    var User = require('./models/users');
    var ObjectId = require('mongoose').Types.ObjectId;

    // ****************** GETS START ******************** 

    app.get('/', function(req, res) {
        res.render('index');
    });


    app.get('/facebook', function(req, res) {
        res.render('facebook');
    });

    app.get('/success', function(req, res) {
    	var user = req.user.facebook;
        res.render('success', {user: user });
    });

    app.get('/failed', function(req, res) {
        res.render('failed');
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
        successRedirect: '/success',
        failureRedirect: '/failed'
    }));

};

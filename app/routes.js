module.exports = function(app, passport) {



    //DB Stuff
    var User = require('./models/users');
    var Place = require('./models/places');
    var UserPreference = require('./models/userpreferences');
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
        res.render('success', { user: user });
    });

    app.get('/failed', function(req, res) {
        res.render('failed');
    });




    // ****************** GETS END ******************** 

    // ****************** POST START ******************** 

    //API that gets all places that user has not shown preference
    app.get('/api/getPlacesBundle', function(req, res) {
        //get all Json of places db that does not appear in user preference for userid
        //Get all places

        /*
            Parameters Required
            1. user logged in - userid
        */
        Place.find({}, function(err, places) {
            if (err) {
                throw (err);
            }

            // req.params.userid <-- userid to get user logged in and edit next line
            UserPreference.find({ "userid": "5800732a957f2a3e4c911977" }, "placeid", function(err1, userpreferences) { // find all and if found then w
                if (err1) {
                    throw (err1);
                }

                if (userpreferences.length == 0) {
                    res.json(places);
                } else {
                    var map = {};
                    for (var i = 0; i < userpreferences.length; i++) {
                        map[userpreferences[i].placeid] = true; // all preferences found will be saved as true on the map
                    }
                    var jsonBundleToReturn = [];

                    for (var j = 0; j < places.length; j++) {
                        if (map[places[j]._id] == undefined) {
                            jsonBundleToReturn.push(places[j]);
                        }
                    }

                    res.json(jsonBundleToReturn);

                }


            });
        });
    });

    //     // Here doc will have all the info

    // });

    // UserPreference.find({ "userid": "5800732a957f2a3e4c911977"}, "placeid", function(err1, userpreferences) { // find all and if found then w
    //     if (err1) {
    //         throw (err1);
    //     }
    //     console.log(userpreferences[0]);
    //     for(var i = 0; i<userpreferences.length;i++){
    //         console.log(userpreferences[i].placeid);
    //     }


    //     res.json(userpreferences);

    // });


    // //API to store user preference
    // app.get('/api/insertPreference') {
    //     //required information
    //     // userid ,place id , isLiked


    // }






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

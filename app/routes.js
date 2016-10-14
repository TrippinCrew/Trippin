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


    //API to store user preference
    app.get('/api/insertPreference', function(req, res) {
        //required information
        // userid ,place id , isLiked, city
        /*
            Get input from ajax
        */
        var newUserPreference = new UserPreference();
        newUserPreference.userid = "Insert userid";
        newUserPreference.placeid = "Insert placeid";
        newUserPreference.isliked = 1;
        newUserPreference.city = "Insert city";

        newUserPreference.save(function(err) {
            if (err) {
                throw err;
            }

            res.json({ 'status': 'success' }); // for success
        });
    });

    //Shouldnt be API call but do first
    app.get("/recommendTopThree", function(req, res) {
        /*
            Input from front : userid
        */

        UserPreference.aggregate([{ "$match": { "userid": "A", "isliked": 1 } },{ "$group": { "_id":"$city", "count": { "$sum": 1 } } }], function(err, doc) {
            if (err) {
                throw err;
            }
            console.log(doc);
            doc.sort(function(a,b){return b.count-a.count});
            var returnDoc = doc.slice(0,3);
            res.json(returnDoc); //[{"_id":"SG","count":2},{"_id":"MY","count":2},{"_id":"TK","count":1}]

        });


        // UserPreference.find({ "userid": "A" }, "userid placeid city", { "sort": { "city": 1 } }, function(err, doc) {


        //     if (err) {
        //         throw err;
        //     }
        //     var map = {};
        //     for (var i = 0; i < doc.length; i++) {
        //         if (map[doc.city] == undefined) {
        //             map[doc.city] = 1;
        //         } else {
        //             var count = map[doc.city];
        //             map[doc.city] = count + 1;
        //         }
        //     }

        //     var keys = Object.keys(map);

        //     var top3Array = [];

        //     for (i = 0; i < keys.length; i++) {
        //         if (top3Array.length < 3) {
        //             top3Array.push({ city: keys[i], count: map[keys[i]] });
        //         } else {
        //             for (f = 0; f < 3; f++) {
        //                 var obj = map[keys[i]];
        //                 var can = top3Array[f];
        //                 if (obj > top3Array[f].count) {
        //                     top3Array[f] = { city: keys[i], count: map[keys[i]] }
        //                 }
        //             }
        //         }
        //     }

        //     res.json(top3Array);
        // })


    });








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

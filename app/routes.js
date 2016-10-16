module.exports = function(app, passport) {



    //DB Stuff
    var User = require('./models/users');
    var Place = require('./models/places');
    var UserPreference = require('./models/userpreferences');
    var DistanceMatrix = require('./models/distancematrixs');
    var ObjectId = require('mongoose').Types.ObjectId;

    var isDevelopment = false;
    // ****************** GETS START ******************** 

    app.get('/', function(req, res) {
        res.render('welcome');
    });

    app.get('/swippin', function(req, res) {
        if (isDevelopment) {
            res.render('swippin');
        } else {
            console.log(req.user);
            var user = req.user;
            res.render('swippin', { user: user });
        }
    });

    app.get('/preference', function(req, res) {
        res.render('preference');
    });

    app.get('/recommendation', function(req, res) {
        var user = req.user;
        res.render('recommendation', { user: user });
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

    app.get('/profile', function(req, res) {
        res.render('profile');
    });

    app.get('/hotel', function(req, res) {
        res.render('hotel');
    });

    app.get('/complete', function(req, res) {
        res.render('complete');
    });

    app.get("/itinerary",function(req,res){
        res.render('itinerary', {user: req.user});
    });

app.get('/highlights', function(req, res) {
        res.render('highlights', {user: req.user});
    });

    app.get('/fullItinerary',function(req,res){

        res.render('fullItinerary');
    });

    app.get('/byday',function(req,res){

        res.render('byday');
    })

    // ****************** GETS END ******************** 

    // ****************** POST START ******************** 
    var request = require('request');

    app.get('/api/getFlash', function(req,res){
        var json = req.flash('itinerary');
        res.render(json);

    });

    var SabreDevStudio = require('sabre-dev-studio');
        var sabre = new SabreDevStudio({
            client_id: 'V1:hskacf2ugrydi3ky:DEVCENTER:EXT',
            client_secret: 'IG4x7ggB',
            uri: 'https://api.test.sabre.com'

        });

        var HashMap = require("Hashmap");
        app.get('/getAllFlights', function(req, res) {
            var country = req.param('country', "Thailand");
            var flights = new HashMap();
            var count = 0;
            var addFlight = function(data, maxCount) {
                count++;
                if (data.errorCode == undefined) {
                    var a = data.Airports;
                    for (i = 0; i < a.length; i++) {
                        if (flights.get(a[i].code) == undefined) {
                            flights.set(a[i].code, a[i]);
                        }
                    }
                }
                if (count == maxCount) {
                    var flightsCount = flights.count();
                    console.log("Flights Count:" + flightsCount);
                    var iti = [];
                    var addIti = function(data, lastIndex) {
                            if (data.length > 0) {
                                for (f = 0; f < data.length; f++) {
                                    iti.push(data[f]);
                                }
                            }
                            if (lastIndex == flightsCount) {
                                res.send(JSON.stringify(iti));
                            }
                        }
                        //console.log(JSON.stringify(flights));
                    var f = 1;
                    flights.forEach(function(value, key) {
                        getFlights(key, f, addIti);
                        f++;
                    });
                }
            }



            sabre.get("/v1/lists/utilities/geoservices/autocomplete", { query: country, category: "AIR" }, function(error, data) {
                var obj = JSON.parse(data);
                if (obj.Response != undefined) {
                    var cities = obj.Response.grouped[Object.keys(obj.Response.grouped)[0]].doclist.docs;
                    if (cities != undefined) {
                        for (i = 0; i < cities.length; i++) {
                            getAirports(cities[i].iataCityCode, addFlight, cities.length);
                        }
                    } else {
                        res.send({ error: "No results" });
                    }
                } else {
                    res.send({ error: "No results" })
                }

            });
        });

        function getAirports(cityCode, callback, lengthOfCities) {
            sabre.get("/v1/lists/supported/cities/" + cityCode + "/airports", {}, function(error, data) {
                callback(JSON.parse(data), lengthOfCities);
            })
        }

        function getFlights(cityCode, lastIndex, callback) {
            var today = new Date();
            sabre.get("/v1/shop/flights/cheapest/fares/" + cityCode, { pointofsalecountry: "SG" }, function(error, data) {
                var flightResponse = JSON.parse(data);
                var result = [];
                if (data.errorCode == undefined) {
                    if (flightResponse != undefined && flightResponse.DestinationLocation != undefined) {
                        var destinationCode = flightResponse.DestinationLocation;
                        var fareInfo = flightResponse.FareInfo;
                        for (i = 0; i < fareInfo.length; i++) {
                            if (fareInfo[i].OriginLocation == "SIN") {
                                result.push({ destination: destinationCode, fareInfo: fareInfo[i] });
                            }
                        }
                    }
                }
                callback(result, lastIndex);
            });
        }

    app.post('/api/getSchedule', function(req, res) {
        var userid = req.body.userid;
        var mustGo = req.body.mustGo;
        var travelData = req.body.travelData;
        var distanceData = req.body.distanceData;
        var travelDays = req.body.travelDays;
        var cashFlow = req.body.cashFlow;
        console.log(travelDays);
        var formData = {
            cashFlow: cashFlow,
            travelDays: 5,
            startTime: 800,
            endTime: 2300,
            startAddress: -1,
            endAddress: -1,
            mustGo: -1,
            travelData: travelData,
            distanceData: distanceData,
            preferences: -1
        };

         request.post({ url: 'http://128.199.235.198:8080/TripEngine/TripEngine', form: formData }, function(err, httpResponse, body) {
            if (err) {
                console.log("err");
                throw err;
            }
            // res.json(JSON.parse(body));


            console.log(JSON.parse(body));


            res.json(JSON.parse(body));
            /* ... */
        });


    });

    app.get('/api/getAllDistanceMatrix', function(req, res) {
        DistanceMatrix.find({}, function(err, dm) {
            if (err) {
                throw err;
            }
            res.json(dm);
        });
    });

    app.get('/api/getAllPlaces', function(req, res) {
        Place.find({}, function(err, places) {
            if (err) {
                throw err;
            }

            res.json(places);
        });

    });

    app.get('/api/getAllUsers', function(req, res) {
        User.find({}, function(err, doc) {
            if (err) {
                throw err;
            }

            res.json(doc);

        });



    });

    app.get('/api/getAllUserPreferences', function(req, res) {
        UserPreference.find({}, function(err, doc) {
            if (err) {
                throw err;
            }

            res.json(doc);

        });

    });


    //API to send frontend array of like dislikes etc
    app.get('/api/getAllUserArrays', function(req, res) {
        var userid = req.query.userid; // means users id will be one of the parameters

        // 1 array for likes  pos 0
        // 1 array for dislikes pos 1
        // 1 array for remain pos 2
        Place.find({}, function(err, places) {
            if (err) {
                throw err;
            }
            UserPreference.find({ "userid": req.query.userid }, function(err1, userpreferences) {
                if (err1) {
                    throw err1;
                }
                if (userpreferences.length == 0) {
                    replyArray([], [], places);
                } else {
                    var HashMap = require('hashmap');
                    var map = new HashMap();

                    for (var i = 0; i < userpreferences.length; i++) {
                        // console.log("userid-" + userid);
                        // console.log("userpreferences.placeid-" + userpreferences[i].placeid);
                        // console.log("userpreferences.isliked-" + userpreferences[i].isliked);
                        if (parseInt(userpreferences[i].isliked) == 1) {
                            map.set(userpreferences[i].placeid, 1);

                        } else {
                            map.set(userpreferences[i].placeid, 0);

                        }

                        // map.set(userpreferences[i].placeid, userpreferences.isliked);
                        // map[userpreferences[i].placeid] = userpreferences.isliked; // all preferences found will be saved as true on the map
                    }
                    var like = [];
                    var dislike = [];
                    var remain = [];
                    for (var j = 0; j < places.length; j++) {
                        var value = map.get(places[j]._id.toString());
                        if (value == 1) {
                            like.push(places[j]);
                        } else if (value == 0) {
                            dislike.push(places[j]);
                        } else {
                            remain.push(places[j]);
                        }
                    }
                    replyArray(like, dislike, remain);
                }
            });


        });

        function replyArray(like, dislike, remain) {
            var replyArray = [like, dislike, remain]; //position 0 will be like , 1 will be dislike , 2 will be remain
            res.json(replyArray);
        }



    });


    //API to send frontend array of like dislikes etc
    app.get('/api/getAllUserArraysByCityTopThree', function(req, res) {
        var userid = req.query.userid; // means users id will be one of the parameters

        UserPreference.aggregate([{ "$match": { "userid": userid, "isliked": 1 } }, { "$group": { "_id": "$city", "count": { "$sum": 1 } } }], function(err, doc) {
            if (err) {
                throw err;
            }
            doc.sort(function(a, b) {
                return b.count - a.count;
            });
            var returnDoc = doc.slice(0, 3);

            res.json(returnDoc); //[{"_id":"SG","count":2},{"_id":"MY","count":2},{"_id":"TK","count":1}]

        });



    });






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
        newUserPreference.userid = req.query.userid;
        newUserPreference.placeid = req.query.placeid;
        newUserPreference.isliked = req.query.isliked;
        newUserPreference.city = req.query.city;

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
        var userid = req.query.userid;
        UserPreference.aggregate([{ "$match": { "userid": "A", "isliked": 1 } }, { "$group": { "_id": "$city", "count": { "$sum": 1 } } }], function(err, doc) {
            if (err) {
                throw err;
            }
            doc.sort(function(a, b) {
                return b.count - a.count
            });
            var returnDoc = doc.slice(0, 3);
            res.json(returnDoc); //[{"_id":"SG","count":2},{"_id":"MY","count":2},{"_id":"TK","count":1}]

        });

    });

    var request = require('request');

    app.get("/test", function(req, res) { //ensure that there's an id field
        request('http://128.199.235.198:8080/TripEngine/TripEngine?cashFlow=500&travelDays=3&startTime=800&endTime=2000&startAddress=&endAddress=&mustGo=&preferences=', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the Google homepage.
            }

            var jsonObject = JSON.parse(body);
            console.log(jsonObject);
            res.json(jsonObject);
        });
    });






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

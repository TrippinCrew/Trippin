var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');

var app = express();

var myPort = 5000;

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport);

//templating engine (Swig)
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views')); // find in views folder
app.set('view engine', 'html');


//middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// required for passport
app.use(session({ secret: 'trippin' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes.js')(app, passport); 

// Starting of the port
app.listen(process.env.PORT || myPort, function(err, res) {
    if (err) {
        console.log("An error has occured starting application");
    } else {
        console.log("Server started on port: " + myPort);
    }
});


module.exports = app;
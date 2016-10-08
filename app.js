var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');


var app = express();

var myPort = 5000;

//templating engine (Swig)
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views')); // find in views folder
app.set('view engine', 'html');

//middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes.js')(app);

// Starting of the port
app.listen(process.env.PORT || myPort, function(err, res) {
    if (err) {
        console.log("An error has occured starting application");
    } else {
        console.log("Server started on port: " + myPort);
    }
});


module.exports = app;
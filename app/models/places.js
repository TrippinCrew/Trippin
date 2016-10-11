// load the things we need
var mongoose = require('mongoose');

// define the schema for our place model

var placeSchema = mongoose.Schema({
    id: Number, //Identifier for places
    name: String, // Name of place
    price: String, // price of place
    opening: String, // opening hour
    closing: String, // closing hour
    address: Number, // Address
    picture: String, //picture url/ title
    description: String, // Description of place
    url: String, // trip advisor URL
    geolocation: { type: [Number], index: '2d' }
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);

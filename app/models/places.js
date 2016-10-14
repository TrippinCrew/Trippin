// load the things we need
var mongoose = require('mongoose');

// define the schema for our place model

var placeSchema = mongoose.Schema({
    //_id: will be used to identify <---- auto populated
    // id: Number, //Identifier for places <Omitted>
    city: String, // City which the place is in
    name: String, // Name of place
    category: String, //Cat
    utility: Number,
    price: Number, // price of place
    opening: Number, // opening hour
    closing: Number, // closing hour
    recommendedTime: Number, //Recommended time
    address: String, // Address
    postal: String, // Postalcode
    lat: Number,
    lng: Number,
    picture: String, //picture url/ title
    description: String, // Description of place
    url: String // trip advisor URL
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Place', placeSchema);

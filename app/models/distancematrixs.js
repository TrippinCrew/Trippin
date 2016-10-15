// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our place model

var distanceMatrixSchema = mongoose.Schema({
    //_id: will be used to identify <---- auto populated
    // id: Number, //Identifier for places <Omitted>
    origin : Schema.Types.ObjectId,
    destination : Schema.Types.ObjectId,
    duration : Number
});



// create the model for users and expose it to our app
module.exports = mongoose.model('DistanceMatrix', distanceMatrixSchema);
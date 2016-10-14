// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userPreferenceSchema = mongoose.Schema({
    userid: String,
    placeid: String,
    isliked: Number
});



// create the model for users and expose it to our app
module.exports = mongoose.model('UserPreference', userPreferenceSchema);
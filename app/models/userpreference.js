// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userPreferenceSchema = mongoose.Schema({
    userid: String,
    placeid: String,
    isliked: Number // 0 = not swipped, -1 = dislike , 1 = like;
});



// create the model for users and expose it to our app
module.exports = mongoose.model('UserPreference', userPreferenceSchema);
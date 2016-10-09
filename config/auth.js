// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'facebookAuth': {
        'clientID': '1806055156345638', // your App ID
        'clientSecret': 'b222f3a2cc62f24fa2649d52da16b912', // your App Secret
        'callbackURL': 'http://localhost:5000/auth/facebook/callback',
    }
};

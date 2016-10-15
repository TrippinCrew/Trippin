var attractions = [];
var processed = { cities: [] };
var limit = 3;
var cardLimit = 5;
var noteworthy = [];
var avoid = [];
var cards = [];

var filterSentiment = function(arr, propertyString) {
    for (var i = 0; i < arr.length; i++) {
        var arrObj = arr[i];
        if (processed.cities.indexOf(arrObj.city) === -1) {
            processed[arrObj.city] = 1;
            processed.cities.push(arrObj.city);
        } else {
            processed[arrObj.city] = processed[arrObj.city] + 1;
        }
        if (processed[arrObj.city + propertyString] === undefined) {
            processed[arrObj.city + propertyString] = 1;
        } else {
            processed[arrObj.city + propertyString] = processed[arrObj.city + propertyString] + 1;
        }
    }
};

var updateBias = function() {
    noteworthy = [];
    avoid = [];
    for (var i = 0; i < processed.cities.length; i++) {
        var tempCity = processed.cities[i];
        var numberOfHits = processed[tempCity];
        if (numberOfHits >= limit) {
            if (processed[tempCity + '_likes'] >= (processed[tempCity + '_dislikes'] * 2)) {
                noteworthy.push(tempCity);
            } else if (processed[tempCity + '_dislikes'] >= (processed[tempCity + '_likes'] * 2)) {
                avoid.push(tempCity);
            }
        }
    }
};

var fillCard = function() {
    cards = [];
    var tempRemain = attractions[2].slice(0);
    tempRemain = shuffleArray(tempRemain);
    while (tempRemain.length !== 0 && cards.length < cardLimit) {
        for (var i = 0; i < tempRemain.length; i++) {
            if (noteworthy.indexOf(tempRemain[i].city) !== -1) {
                cards.push(tempRemain[i]);
                tempRemain.splice(i, 1);
                i -= 1;
                if (cards.length === cardLimit) {
                    tempRemain = [];
                }
            }
        }
        for (var j = 0; j < tempRemain.length; j++) {
            if (avoid.indexOf(tempRemain[j].city) === -1) {
                cards.push(tempRemain[j]);
                tempRemain.splice(j, 1);
                j -= 1;
                if (cards.length === cardLimit) {
                    tempRemain = [];
                }
            }
        }
        for (var k = 0; k < tempRemain.length; k++) {
            cards.push(tempRemain[k]);
            tempRemain.splice(k, 1);
            k -= 1;
            if (cards.length === cardLimit) {
                tempRemain = [];
            }
        }
    }
};

var preprocessAttractions = function() {
    var likedAttractions = attractions[0];
    this.filterSentiment(likedAttractions, '_likes');
    var dislikedAttractions = attractions[1];
    this.filterSentiment(dislikedAttractions, '_dislikes');
    this.updateBias();
    this.fillCard();
};

var swipeRight = function(id) {
    var likedObj;
    for (var i = 0; i < attractions[2].length; i++) {
        if (attractions[2][i]._id === id) {
            likedObj = attractions[2][i];
            attractions[2].splice(i, 1);
            i = attractions[2].length;
        }
    }
    attractions[0].push(likedObj);
    var tempArr = [];
    tempArr.push(likedObj);
    this.filterSentiment(tempArr, '_likes');
    cards.splice(0, 1);
    if (cards.length === 0) {
        this.reloadCards();
        // populateCards();
        addJtinderCards();
    }
    //< CALL AJAX HERE >
};

var swipeLeft = function(id) {
    var dislikedObj;
    for (var i = 0; i < attractions[2].length; i++) {
        if (attractions[2][i]._id === id) {
            dislikedObj = attractions[2][i];
            attractions[2].splice(i, 1);
            i = attractions[2].length;
        }
    }
    attractions[1].push(dislikedObj);
    var tempArr = [];
    tempArr.push(dislikedObj);
    this.filterSentiment(tempArr, '_dislikes');
    cards.splice(0, 1);
    if (cards.length === 0) {
        this.reloadCards();
        // populateCards();
        addJtinderCards();
    }
    //< CALL AJAX HERE >
};

var reloadCards = function() {
    this.updateBias();
    this.fillCard();
};

var shuffleArray = function(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function getCards() {
    $.ajax({
            method: "GET",
            url: "/api/getAllUserArrays?userid=" + getUserId(),
            async: false
        })
        .done(function(res) {
            attractions = res;
            preprocessAttractions();
        });
}


$().ready(function() {
    getCards();
    // populateCards();
    addJtinderCards();
    console.log(cards);
    checkLastAttraction();
});

function populateCards() {
    $('#emu_cards').html('');
    for (var i = 0; i < cards.length; i++) {
        $('#emu_cards').append('<div class="emu_css" city="' + cards[i].city + '" id="' + cards[i]._id + '">' + cards[i].city + ',' + cards[i].name + '</div>')
    }
}

$('#emu_dislike').click(function() {
    // swipeLeft(asd);
    var currentCard = $('#emu_cards div:first-child');
    var curentCardId = currentCard.attr('id');
    var curentCardCity = currentCard.attr('city');

    swipeLeft(curentCardId);
    currentCard.remove();

    console.log(attractions);

    //like = 1
    //dislike = 0
    //store db at each swipe
    storePreferenceDb(getUserId(), curentCardId, 0, curentCardCity)

});


$('#emu_like').click(function() {
    var currentCard = $('#emu_cards div:first-child');
    var curentCardId = currentCard.attr('id');
    var curentCardCity = currentCard.attr('city');

    swipeRight(curentCardId);
    currentCard.remove();
    console.log(attractions);
    storePreferenceDb(getUserId(), curentCardId, 1, curentCardCity)
});


function dislikeSwipped() {
    // swipeLeft(asd);
    var currentCard = $('#tinderslide li:last-child');
    var curentCardId = currentCard.attr('id');
    var curentCardCity = currentCard.attr('city');

    swipeLeft(curentCardId);
    currentCard.remove();

    console.log(attractions);

    //like = 1
    //dislike = 0
    //store db at each swipe
    storePreferenceDb(getUserId(), curentCardId, 0, curentCardCity)
}

function likeSwipped() {
    var currentCard = $('#tinderslide li:last-child');
    var curentCardId = currentCard.attr('id');
    var curentCardCity = currentCard.attr('city');

    swipeRight(curentCardId);
    currentCard.remove();
    console.log(attractions);
    storePreferenceDb(getUserId(), curentCardId, 1, curentCardCity)
}


function storePreferenceDb(userid, placeid, isliked, city) {
    
    // userid ,place id , isLiked, city
    $.ajax({
            method: "GET",
            url: "/api/insertPreference?userid=" + userid + "&placeid=" + placeid + "&isliked=" + isliked + "&city=" + city,
            async: false
        })
        .done(function(res) {

        });
}


function addJtinderCards() {
    clearCards();
    for (var i = 0; i < cards.length; i++) {
        $("#tinderslide ul").append('<li class="card" city="' + cards[i].city + '" id="' + cards[i]._id + '">' +
            '<div><img class="image" src="' + cards[i].picture + '"></div>' +
            '<div class="location">' + cards[i].name + '</div>' +
            '<div class="place">' +
            cards[i].city +
            '</div>' +
            // '<div class="description">' +
            // 'Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa.' +
            // '</div>' +
            '<div class="like"></div>' +
            '<div class="dislike"></div>' +
            '</li>');

    }
    $("#tinderslide").jTinder({
        // dislike callback
        onDislike: function(item) {
            dislikeSwipped();
        },
        // like callback
        onLike: function(item) {
            likeSwipped();
        },
        animationRevertSpeed: 200,
        animationSpeed: 500,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
    });

}

function clearCards() {
    $('.card').remove();
}

function checkLastAttraction(){
    if(attractions[2].length <= 0){
          $("#tinderslide ul").append('<li class="cards"><h1>No more cards</h1></li>');
    }
}
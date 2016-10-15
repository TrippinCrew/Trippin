var attractions = [like:..., dislike:..., remain:...];
var processed = {cities: []};
var limit = 6;
var cardLimit = 20;
var noteworthy = [];
var avoid = [];
var cards = [];

var filterSentiment = function(arr, propertyString){
    for (var i = 0; i < arr.length; i++){
        var arrObj = arr[i];
        if (processed.cities.indexOf(arrObj.city) === -1){
            processed[arrObj.city] = 1;
            process.cities.push(arrObj.city);
        } else {
            processed[arrObj.city] = processed[arrObj.city] + 1;
        }
        if (processed[arrObj.city + propertyString] === undefined){
            processed[arrObj.city + propertyString] = 1;
        } else {
            processed[arrObj.city + propertyString] = processed[likedObj.city + propertyString] + 1;
        }
    }
};

var updateBias = function(){
    noteworthy = [];
    avoid = [];
    for (var i = 0; i < processed.cities.length; i++){
        var tempCity = processed.cities[i];
        var numberOfHits = processed[tempCity];
        if (numberOfHits >= limit){
            if (processed[tempCity + '_likes'] >= (processed[tempCity + '_dislikes'] * 2)){
                noteworthy.push(tempCity);
            } else if (processed[tempCity + '_dislikes'] >= (processed[tempCity + '_likes'] * 2)){
                avoid.push(tempCity);
            }
        }
    }
};

var fillCard = function(){
    var tempRemain = attractions[2].slice(0);
    tempRemain = shuffleArray(tempRemain);
    while (tempRemain.length !== 0 && cards.length < cardLimit){
        for (var i = 0; i < tempRemain.length; i++){
            if (noteworthy.indexOf(tempRemain[i].city) !== -1){
                cards.push(tempRemain[i]);
                tempRemain.splice(i, 1);
                i -= 1;
                if (cards.length === cardLimit){
                    tempRemain = [];
                }
            }
        }
        for (var j = 0; j < tempRemain.length; j++){
            if (avoid.indexOf(tempRemain[j].city) === -1){
                cards.push(tempRemain[j]);
                tempRemain.splice(j, 1);
                j -= 1;
                if (cards.length === cardLimit){
                    tempRemain = [];
                }
            }
        }
        for (var k = 0; k < tempRemain.length; k++){
            cards.push(tempRemain[k]);
            tempRemain.splice(k, 1);
            k -= 1;
            if (cards.length === cardLimit){
                tempRemain = [];
            }
        }
    }
};

var preprocessAttractions = function(){
    var likedAttractions = attractions[0];
    this.filterSentiment(likedAttractions, '_likes');
    var dislikedAttractions = attractions[1];
    this.filterSentiment(dislikedAttractions, '_dislikes');
    this.updateBias();
    this.fillCard();
}

var swipeRight = function(id){
    var likedObj;
    for (var i = 0; i < attractions[2].length; i++){
        if (attractions[2][i]._id === id){
            likedObj = attractions[2][i];
            attractions[2].splice(i, 1);
            i = attractions[2].length;
        }
    }
    attractions[0].push(likedObj);
    var tempArr = [];
    tempArr.push(likedObj);
    this.filterSentiment(tempArr, '_likes');
    <CALL AJAX HERE>
};

var swipeLeft = function(id){
    var dislikedObj;
    for (var i = 0; i < attractions[2].length; i++){
        if (attractions[2][i]._id === id){
            dislikedObj = attractions[2][i];
            attractions[2].splice(i, 1);
            i = attractions[2].length;
        }
    }
    attractions[1].push(dislikedObj);
    var tempArr = [];
    tempArr.push(dislikedObj);
    this.filterSentiment(tempArr, '_dislikes');
    <CALL AJAX HERE>
};

var reloadCards = function(){
    this.updateBias();
    this.fillCard();
};

var shuffleArray = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

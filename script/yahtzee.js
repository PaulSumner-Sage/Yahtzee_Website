const SCOREBOARD = document.querySelector(".diceResults");
const TOTALSCORES = document.querySelector(".totals");

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function miniumum_of_a_kind(set_to_check, num) {
    
    var count = {};

    // Count occurances of each number in the set
    for (var index = 0; index < set_to_check.length; index++) {
        var number = set_to_check[index];
        count[number] = count[number] ? count[number] + 1 : 1;
    }

    // If there are any occurrences larger than num return true
    for (var key in count) {
        if(count[key] >= num) {
            return true;
        }
    }
    return false;
}

function exact_of_a_kind(set_to_check, num) {
        
    var count = {};

    // Count occurances of each number in the set
    for (var index = 0; index < set_to_check.length; index++) {
        var number = set_to_check[index];
        count[number] = count[number] ? count[number] + 1 : 1;
    }

    // If there are any occurrences equal to num return true
    for (var key in count) {
        if(count[key] == num) {
            return true;
        }
    }
    return false;
}

function is_full_house(set_to_check) {
    return (exact_of_a_kind(set_to_check, 2) && exact_of_a_kind(set_to_check, 3));
}

function minimum_consecutive(set_to_check, num) {
    var straight_count = 1;
    //sort and remove duplicates
    set_to_check = set_to_check.sort().filter( onlyUnique );

    // seacrh through each value and compare to the next. 
    // if consecutive add to the straight count.
    // if target count is reached, break out and return result early.
    for(var index = 0; index < set_to_check.length; index++) {
        if (index < set_to_check.length-1){
            if ((set_to_check[index+1] - set_to_check[index]) > 1) {
                if (straight_count >= num) {
                    break;
                }
                straight_count = 1;
            }
            straight_count += 1;
        }
    }

    return (straight_count >= num);
}

function is_yahtzee(set_to_check) {
    var set_unique = set_to_check.filter( onlyUnique );
    return (set_unique.length == 1);
}

function calculate_bonus_score() {
    var scores_to_check = [];
    sets.forEach(element => {
        scores_to_check.push(element);
    }) 
    scores_to_check.push(three_of_a_kind);
    scores_to_check.push(four_of_a_kind);
    scores_to_check.push(short_straight);
    scores_to_check.push(long_straight);
    scores_to_check.push(full_house);
    scores_to_check.push(chance);
    
    if(is_yahtzee(yahtzee)) {
        sets_to_check.forEach(set => {
            if(is_yahtzee(set)) {
                yahtzee_bonus_score += 100;
            }
        })
    }
}

function score_set (set_to_check, num) {
    var count = 0;
    for(var i = 0; i < set_to_check.length; ++i) {
        if(set_to_check[i] == num) {
            count += num;
        }
    }
    sets_score[num-1] = count;
    return count;
}

function calculate_upper_scores() {
    var set = 1;
    sets.forEach(element => {
        // for now just add up all numbers regardless of content or correct numbers
        upperScore += score_set(element, set++); //element.reduce((a, b) => a + b, 0);
    })

    upperScore >= 63 ? upperScore += 35 : upperScore;
}

function calculate_lower_scores() {
    //Three of a kind
    if (miniumum_of_a_kind(three_of_a_kind, 3)) {
        three_of_a_kind_score += three_of_a_kind.reduce((a, b) => a + b, 0);
    }
    //Four of a kind
    if (miniumum_of_a_kind(four_of_a_kind, 4)) {
        four_of_a_kind_score += four_of_a_kind.reduce((a, b) => a + b, 0);
    }
    //Full house
    if (is_full_house(full_house)) {
        full_house_score = 25;
    }
    //Short Straight
    if (minimum_consecutive(short_straight, 4)) {
        short_straight_score = 30;
    }
    //Long Straight
    if (minimum_consecutive(long_straight, 5)) {
        long_straight_score = 40;
    }
    //Chance
    chance_score = chance.reduce((a, b) => a + b, 0);

    //Yahtzee
    if (is_yahtzee(yahtzee)) {
        yahtzee_score = 50;
    }
    //Yahzee Bonus
    calculate_bonus_score();

    lowerScore += three_of_a_kind_score;
    lowerScore += four_of_a_kind_score;
    lowerScore += short_straight_score;
    lowerScore += long_straight_score;
    lowerScore += full_house_score;
    lowerScore += chance_score;
    lowerScore += yahtzee_score;
    lowerScore += yahtzee_bonus_score;
}

function calculate_scores() {
    calculate_upper_scores();
    calculate_lower_scores();
}

function print_scores() {
    scoreboard_Output = "<div class=\"col-left\">"
    scoreboard_Output += "<h3>Upper Scores</h3>" ;
    scoreboard_Output += "<p> Set of ones: " + sets_score[0] + "</p>";
    scoreboard_Output += "<p> Set of twos: " + sets_score[1] + "</p>";
    scoreboard_Output += "<p> Set of threes: " + sets_score[2] + "</p>";
    scoreboard_Output += "<p> Set of fours: " + sets_score[3] + "</p>";
    scoreboard_Output += "<p> Set of fives: " + sets_score[4] + "</p>";
    scoreboard_Output += "<p> Set of sixes: " + sets_score[5] + "</p>";
    scoreboard_Output += "</div>"
    scoreboard_Output += "<div class=\"col-right\">"
    scoreboard_Output += "<h3>Lower Scores</h3>";
    scoreboard_Output += "<p>Three of a kind: " + three_of_a_kind_score + "</p>";
    scoreboard_Output += "<p>Four of a kind: " + four_of_a_kind_score + "</p>";
    scoreboard_Output += "<p>Full House: " + full_house_score + "</p>";
    scoreboard_Output += "<p>Short Straight: " + short_straight_score + "</p>";
    scoreboard_Output += "<p>Long Straight: " + long_straight_score + "</p>";
    scoreboard_Output += "<p>Yahtzee: " + yahtzee_score + "</p>";
    scoreboard_Output += "<p>Chance: " + chance_score + "</p>";
    scoreboard_Output += "</div>"
    
    SCOREBOARD.innerHTML = scoreboard_Output;
    
    if (upperScore >= 98) {
        scores_Output = "<h4> Total Upper Score: : " + upperScore + "&nbsp" + "</h4><h5>(With a bonus of 35!)</h5>";
    } else {
        scores_Output += "<h4> Total Upper Score: : " + upperScore + "</h4>";
    }
    scores_Output += "</br><h4> Total Lower Score: : " + lowerScore + "</h4>";
    scores_Output += "<h3>The Total Score is: " + (upperScore+lowerScore) + "</h3>";
    
    TOTALSCORES.innerHTML = scores_Output;
}

/*
*  Setting up global variables and initialising scores to zero
*  Creating a scorecard class could clean this up
*/

sets_score = [];

var three_of_a_kind_score = 0;
var four_of_a_kind_score = 0;
var full_house_score = 0;
var short_straight_score = 0;
var long_straight_score = 0;
var chance_score = 0;
var yahtzee_score = 0;
var yahtzee_bonus_score = 0;

var scores = 0;
var upperScore = 0;
var lowerScore = 0;
var sets = [];

/*
*  Default input of scores
*  To be replaced by user input on webpage later
*/

sets[0] = [1,3,1,2,4];
sets[1] = [1,3,1,2,4];
sets[2] = [1,3,1,2,4];
sets[3] = [1,3,1,2,4];
sets[4] = [5,5,5,5,5];
sets[5] = [6,6,6,6,6];

var three_of_a_kind = [2,2,2,4,5];
var four_of_a_kind = [2,2,3,4,5];
var full_house = [2,2,3,3,3];
var short_straight = [2,2,3,4,5];
var long_straight = [1,2,3,4,5];
var yahtzee = [2,2,3,4,5];
var chance = [2,2,3,4,5];

/*
*  Currently static function calculates scores once only
*  Will need to be replaced with user interaction/event trigger
*/
calculate_scores();
print_scores();

const DICEVALUES = document.querySelector(".diceValues");
const SCOREBOARD = document.querySelector(".diceResults");
const TOTALSCORES = document.querySelector(".totals");

function Scoreboard(sets, three_of_a_kind, four_of_a_kind, full_house, short_straight, long_straight, yahtzee, chance){

    this.sets_score = [];
    this.three_of_a_kind_score = 0;
    this.four_of_a_kind_score = 0;
    this.full_house_score = 0;
    this.short_straight_score = 0;
    this.long_straight_score = 0;
    this.chance_score = 0;
    this.yahtzee_score = 0;
    this.yahtzee_bonus_score = 0;

    this.scores = 0;
    this.upperScore = 0;
    this.lowerScore = 0;

    this.sets = sets;
    this.three_of_a_kind = three_of_a_kind;
    this.four_of_a_kind = four_of_a_kind;
    this.full_house = full_house;
    this.short_straight = short_straight;
    this.long_straight = long_straight;
    this.yahtzee = yahtzee;
    this.chance = chance;

    this.onlyUnique = function(value,index,self) {
        return self.indexOf(value) === index;
    }

    this.miniumum_of_a_kind = function(set_to_check, num) {
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

    this.exact_of_a_kind = function(set_to_check, num) {
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

    this.is_full_house = function(set_to_check) {
        return (this.exact_of_a_kind(set_to_check, 2) && this.exact_of_a_kind(set_to_check, 3));
    }

    this.minimum_consecutive = function(set_to_check, num) {
        var straight_count = 1;
        //sort and remove duplicates
        set_to_check = set_to_check.sort().filter( this.onlyUnique );

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

    this.is_yahtzee = function(set_to_check) {
        var set_unique = set_to_check.filter( this.onlyUnique );
        return (set_unique.length == 1);
    }

    this.score_set = function(set_to_check, num) {
        var count = 0;
        for(var i = 0; i < set_to_check.length; ++i) {
            if(set_to_check[i] == num) {
                count += num;
            }
        }
        this.sets_score[num-1] = count;
        return count;
    }

    this.calculate_bonus_score = function() {
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
        
        if(this.is_yahtzee(yahtzee)) {
            scores_to_check.forEach(set => {
                if(this.is_yahtzee(set)) {
                    this.yahtzee_bonus_score += 100;
                }
            })
        }
    }

    this.calculate_upper_scores = function() {
        var set = 1;
        sets.forEach(element => {
            // for now just add up all numbers regardless of content or correct numbers
            this.upperScore += this.score_set(element, set++); //element.reduce((a, b) => a + b, 0);
        })

        this.upperScore >= 63 ? this.upperScore += 35 : this.upperScore;
    }

    this.calculate_lower_scores = function() {
        //Three of a kind
        if (this.miniumum_of_a_kind(this.three_of_a_kind, 3)) {
            this.three_of_a_kind_score = this.three_of_a_kind.reduce((a, b) => a + b, 0);
        }
        //Four of a kind
        if (this.miniumum_of_a_kind(this.four_of_a_kind, 4)) {
            this.four_of_a_kind_score = this.four_of_a_kind.reduce((a, b) => a + b, 0);
        }
        //Full house
        if (this.is_full_house(this.full_house)) {
            this.full_house_score = 25;
        }
        //Short Straight
        if (this.minimum_consecutive(this.short_straight, 4)) {
            this.short_straight_score = 30;
        }
        //Long Straight
        if (this.minimum_consecutive(this.long_straight, 5)) {
            this.long_straight_score = 40;
        }
        //Chance
        this.chance_score = this.chance.reduce((a, b) => a + b, 0);

        //Yahtzee
        if (this.is_yahtzee(this.yahtzee)) {
            this.yahtzee_score = 50;
        }
        //Yahzee Bonus
        this.calculate_bonus_score();

        this.lowerScore += this.three_of_a_kind_score;
        this.lowerScore += this.four_of_a_kind_score;
        this.lowerScore += this.short_straight_score;
        this.lowerScore += this.long_straight_score;
        this.lowerScore += this.full_house_score;
        this.lowerScore += this.chance_score;
        this.lowerScore += this.yahtzee_score;
        this.lowerScore += this.yahtzee_bonus_score;
    }

    this.calculate_scores = function() {
        this.upperScore = 0;
        this.lowerScore = 0;
        this.yahtzee_bonus_score = 0;

        this.calculate_upper_scores();
        this.calculate_lower_scores();
    }

    this.zero_scores = function() {
        this.three_of_a_kind_score = 0;
        this.four_of_a_kind_score = 0;
        this.short_straight_score = 0;
        this.long_straight_score = 0;
        this.full_house_score = 0;
        this.chance_score = 0;
        this.yahtzee_score = 0;
        this.yahtzee_bonus_score = 0;
        this.upperScore = 0;
        this.lowerScore = 0;
        this.scores = 0;
        this.sets_score = [];
    }
}

function print_current_dice() {
    scoreboard.zero_scores();

    var values_Output = "<div class=\"col-left\">";
    values_Output += "<h3>Upper Dice Rolls:</h3>";
    values_Output += "<p> Set of ones: " + scoreboard.sets[0] + "</p>";
    values_Output += "<p> Set of twos: " + scoreboard.sets[1] + "</p>";
    values_Output += "<p> Set of threes: " + scoreboard.sets[2] + "</p>";
    values_Output += "<p> Set of fours: " + scoreboard.sets[3] + "</p>";
    values_Output += "<p> Set of fives: " + scoreboard.sets[4] + "</p>";
    values_Output += "<p> Set of sixes: " + scoreboard.sets[5] + "</p>";
    values_Output += "</div>";

    values_Output += "<div class=\"col-right\">"
    values_Output += "<h3>Lower Dice Rolls:</h3>";
    values_Output += "<p>Three of a kind: " + scoreboard.three_of_a_kind + "</p>";
    values_Output += "<p>Four of a kind: " + scoreboard.four_of_a_kind + "</p>";
    values_Output += "<p>Full House: " + scoreboard.full_house + "</p>";
    values_Output += "<p>Short Straight: " + scoreboard.short_straight + "</p>";
    values_Output += "<p>Long Straight: " + scoreboard.long_straight + "</p>";
    values_Output += "<p>Yahtzee: " + scoreboard.yahtzee + "</p>";
    values_Output += "<p>Chance: " + scoreboard.chance + "</p>";
    values_Output += "</div>";

    DICEVALUES.innerHTML = values_Output;
}

// eslint-disable-next-line no-unused-vars
function print_scores() {
    scoreboard.calculate_scores();

    var scoreboard_Output = "<div class=\"col-left\">"
    scoreboard_Output += "<h3>Upper Scores</h3>" ;
    scoreboard_Output += "<p> Set of ones: " + scoreboard.sets_score[0] + "</p>";
    scoreboard_Output += "<p> Set of twos: " + scoreboard.sets_score[1] + "</p>";
    scoreboard_Output += "<p> Set of threes: " + scoreboard.sets_score[2] + "</p>";
    scoreboard_Output += "<p> Set of fours: " + scoreboard.sets_score[3] + "</p>";
    scoreboard_Output += "<p> Set of fives: " + scoreboard.sets_score[4] + "</p>";
    scoreboard_Output += "<p> Set of sixes: " + scoreboard.sets_score[5] + "</p>";
    scoreboard_Output += "</div>"
    scoreboard_Output += "<div class=\"col-right\">"
    scoreboard_Output += "<h3>Lower Scores</h3>";
    scoreboard_Output += "<p>Three of a kind: " + scoreboard.three_of_a_kind_score + "</p>";
    scoreboard_Output += "<p>Four of a kind: " + scoreboard.four_of_a_kind_score + "</p>";
    scoreboard_Output += "<p>Full House: " + scoreboard.full_house_score + "</p>";
    scoreboard_Output += "<p>Short Straight: " + scoreboard.short_straight_score + "</p>";
    scoreboard_Output += "<p>Long Straight: " + scoreboard.long_straight_score + "</p>";
    scoreboard_Output += "<p>Yahtzee: " + scoreboard.yahtzee_score + "</p>";
    scoreboard_Output += "<p>Chance: " + scoreboard.chance_score + "</p>";
    scoreboard_Output += "</div>"
    
    SCOREBOARD.innerHTML = scoreboard_Output;
    
    var scores_Output = "";
    if (scoreboard.upperScore >= 98) {
        scores_Output = "<h4> Total Upper Score: : " + scoreboard.upperScore + "&nbsp" + "</h4><h5>(With a bonus of 35!)</h5>";
    } else {
        scores_Output += "<h4> Total Upper Score: : " + scoreboard.upperScore + "</h4>";
    }
    scores_Output += "</br><h4> Total Lower Score: : " + scoreboard.lowerScore + "</h4>";
    scores_Output += "<h3>The Total Score is: " + (scoreboard.upperScore+scoreboard.lowerScore) + "</h3>";
    
    TOTALSCORES.innerHTML = scores_Output;
}

function getRandomDieScore() {
    return Math.floor(Math.random() * 6) + 1;
}

function getRandomDieSet() {
    var setToReturn = [];

    for(let i = 0; i < 5; i++) {
        setToReturn.push(getRandomDieScore());
    }
    return setToReturn;
}



// eslint-disable-next-line no-unused-vars
function generate_scores() {
    scoreboard.three_of_a_kind = getRandomDieSet();
    scoreboard.four_of_a_kind = getRandomDieSet();
    scoreboard.full_house = getRandomDieSet();
    scoreboard.short_straight = getRandomDieSet();
    scoreboard.long_straight = getRandomDieSet();
    scoreboard.yahtzee = getRandomDieSet();
    scoreboard.chance = getRandomDieSet();


    for(let i = 0; i <= 5; i++) {
        scoreboard.sets[i] = getRandomDieSet();
    }

    print_current_dice();
    SCOREBOARD.innerHTML = "";
    TOTALSCORES.innerHTML = "";
    
}

var scoreboard;

/*
*  Default input of scores
*  To be replaced by user input on webpage later
*/
var sets = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
]
var three_of_a_kind = [0,0,0,0,0];
var four_of_a_kind = [0,0,0,0,0];
var full_house = [0,0,0,0,0];
var short_straight = [0,0,0,0,0];
var long_straight = [0,0,0,0,0];
var yahtzee = [0,0,0,0,0];
var chance = [0,0,0,0,0];

// var three_of_a_kind = [2,2,2,4,5];
// var four_of_a_kind = [2,2,3,4,5];
// var full_house = [2,2,3,3,3];
// var short_straight = [2,2,3,4,5];
// var long_straight = [1,2,3,4,5];
// var yahtzee = [2,2,3,4,5];
// var chance = [2,2,3,4,5];

scoreboard = new Scoreboard(
    sets, 
    three_of_a_kind, 
    four_of_a_kind, 
    full_house, 
    short_straight, 
    long_straight, 
    yahtzee, 
    chance 
);

/*
*  Currently static function calculates scores once only
*  Will need to be replaced with user interaction/event trigger
*/
scoreboard.calculate_scores();
// print_scores();

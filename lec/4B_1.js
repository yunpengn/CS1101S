// game engine: display-move-switch loop
function play_with_turns(game_state, player) {
    if (game_over(game_state)) {
        return announce_winner(player);
    } else if (player === "human") {
        play_with_turns(human_move(game_state), "computer");
    } else { // player === "computer"
        play_with_turns(computer_move(game_state), "human");
    }
}

// turn game state input into a string
function game_state_to_string(game_state) {
    return "Pile 1: " + size_of_pile(game_state, 1) + "\n" +
           "Pile 2: " + size_of_pile(game_state, 2);
}

// return true iff the game is over
function game_over(game_state) {
    return total_size(game_state) === 0;
}

function total_size(game_state) {
    return size_of_pile(game_state, 1) +
           size_of_pile(game_state, 2);
}

// announce winner using alert
function announce_winner(player) {
    if (player === "human") {
        alert("You lose. Better luck next time.");
    } else {
        alert("You win. Congratulations.");
    }
}

function human_move(game_state) {
    var game_state_string = game_state_to_string(game_state);
    var pile_string =
        prompt(game_state_string + "\n\n" +
               "Which pile will you remove from?");
    var pile = parseInt(pile_string);
    var coins_string =
        prompt(game_state_string + "\n\n" +
               "How many coins do " +
               "you want to remove?");
    var coins = parseInt(coins_string);
    return remove_coins_from_pile(game_state, coins, pile);
}

// Artificial Intelligence
function computer_move(game_state) {
    var pile = (size_of_pile(game_state, 1) > 0) ? 1 : 2;
    alert("I take one coin from pile " + pile);
    return remove_coins_from_pile(game_state, 1, pile);
}


// representing the game state
function make_game_state(n, m) {
    return pair(n, m);
}

function size_of_pile(game_state, p) {
    if (p === 1) {
        return head(game_state);
    } else {
        return tail(game_state);
    }
}

// remove_coins_from_pile has error handling
// for wrong pile missing.
function remove_coins_from_pile(game_state, n, p) {
    if (p < 1 || p > 2) {
        alert("pile must be 1 or 2");
        return game_state;
    } else {
        var new_size = size_of_pile(game_state, p) - n;
        if (new_size >= 0 && n >= 1) {
            if (p === 1) {
                return make_game_state(new_size,
                                       size_of_pile(game_state, 2));
            } else {
                return make_game_state(size_of_pile(game_state, 1),
                                       new_size);
            }
        } else {
            alert("illegal number of coins");
            return game_state;
        }
    }
}

// Running the game engine (use these lines in Interpreter console):
// system.runtime_limit.set_timeout(1000000); // set timeout limit to 1000000 msec
// play_with_turns(make_game_state(4, 3), "human");

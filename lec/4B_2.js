// big changes:
function remove_coins_from_pile(game_state, n, p) {
    if (p === 0) {
        return undo_last_move(game_state);
    } else if (p < 0 || p > 2) {
        alert("pile must be 0, 1 or 2");
        return game_state;
    } else {
        var new_size = size_of_pile(game_state, p) - n;
        if (new_size >= 0 && n >= 1) {
            // correct move; switch "next" 
            var nextnext = (next(game_state) === "human")
                           ? "computer" : "human";
            // return updated game state
            if (p === 1) {
                return make_game_state(new_size,
                       size_of_pile(game_state, 2),
                       game_state,
                       nextnext);
            } else {
                return make_game_state(size_of_pile(game_state, 1),
                       new_size,
                       game_state,
                       nextnext);
            }
        } else {
            alert("illegal number of coins");
            return game_state;
        }
    }
}

// game engine: display-move-switch loop
function play_with_turns(game_state) {
    if (game_over(game_state)) {
        return announce_winner(game_state);
    } else if (next(game_state) === "human") {
        return play_with_turns(human_move(game_state));
    } else { // next(game_state) === "computer"
        return play_with_turns(computer_move(game_state));
    }
}

// turn game state into a string
function game_state_to_string(game_state) {
    return "Pile 1: " + size_of_pile(game_state, 1) + "\n" +
           "Pile 2: " + size_of_pile(game_state, 2);
}

function game_over(game_state) {
    return total_size(game_state) === 0;
}

function total_size(game_state) {
    return size_of_pile(game_state, 1) +
           size_of_pile(game_state, 2);
}

function announce_winner(game_state) {
    if (next(game_state) === "human") {
        alert("You lose. Better luck next time.");
    } else {
        alert("You win. Congratulations.");
    }
}

// almost unchanged
function human_move(game_state) {
    var game_state_string = game_state_to_string(game_state);
    var pile_string =
        prompt(game_state_string + "\n\n" +
               "Which pile will you remove from? " +
               "Type 0 to undo last move.");
    var pile = parseInt(pile_string);
    var coins_string = (pile === 0) ? 0 :
        prompt(game_state_string + "\n\n" +
               "How many coins do " +
               "you want to remove?");
    var coins = parseInt(coins_string);
    return remove_coins_from_pile(game_state, coins, pile);
}

// Artificial "Intelligence": replace by smarter one
function computer_move(game_state) {
    var pile = (size_of_pile(game_state, 1) > 0) ? 1 : 2;
    alert("I take one coin from pile " + pile);
    return remove_coins_from_pile(game_state, 1, pile);
}

//////////////////////////////
// representing the game state
//////////////////////////////

// include previous game_state in state
function make_game_state(n, m, game_state, next) {
    return list(n, m, game_state, next);
}

// use [] to indicate empty state (no undo info)
function make_initial_game_state(n, m, next) {
    return list(n, m, [], next);
}

function size_of_pile(game_state, p) {
    if (p === 1) {
        return head(game_state);
    } else { // p === 2
        return head(tail(game_state));
    }
}

function previous_game_state(game_state) {
    return head(tail(tail(game_state)));
}

function has_previous_game_state(game_state) {
    return !is_empty_list(head(tail(tail(game_state))));
}

function next(game_state) {
    return head(tail(tail(tail(game_state))));
}

function undo_last_move(game_state) {
    if (!has_previous_game_state(game_state) ||
        !has_previous_game_state(previous_game_state(game_state))) {
        alert("nothing to undo");
        return game_state;
    } else {
        return previous_game_state(previous_game_state(game_state));
    }
}

// Running the game engine (use these lines in Interpreter console):
// system.runtime_limit.set_timeout(1000000); // set timeout limit to 1000000 msec
// play_with_turns(make_initial_game_state(4, 3, "human"));

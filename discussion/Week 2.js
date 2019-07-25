// Pre-cond: 1<= x <= 4
function biggie_size(combo) {
    return combo + 4;
}

// Pre-cond: 5<= x <= 8
function unbiggie_size(combo) {
    return combo - 4;
}

function is_biggie_size(combo) {
    return combo > 4;
}

// Notice: Modular function design
function combo_price(combo) {
    if (is_biggie_size(combo)) {
        return unbiggie_size(combo) * 1.17 + 0.5;
    } else {
        return combo * 1.17;
    }
}

function combo_price2(combo) {
    return 1.17 * (is_biggie_size(combo) ? unbiggie_size(combo) : combo) + 0.5 * Math.floor(combo / 4);
}

function empty_order() {
    return 0;
}

function add_to_order(old, combo) {
    return 10 * old + combo;
}

function last_combo(order) {
    return order % 10;
}

function other_combos(order) {
    return (order - order % 10) / 10;
}

function other_combos2(order) {
    return Math.floor(order / 10);
}

// Addtional question
// Version 1: Recursive process
function order_price1(order) {
    return order === empty_order() ? combo_price(empty_order())
                                   : combo_price(last_combo(order)) +
                                     order_price1(other_combos(order));
}

// Version 2: Iterative process
function order_price2(order) {
    function compute(order, sum) {
        return order === empty_order() ? sum
                                       : compute(other_combos(order), sum + combo_price(last_combo(order)));
    }
    return compute(order, 0);
}

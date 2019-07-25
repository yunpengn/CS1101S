// CS1101S @ NUS AY2016-2017 Semester 1
// Discussion Group Week 7
// This week is revision for mid-term test

// Question 1
function twice(f) {
    return function (x) {
        return f(f(x));
    };
}

function thrice(f) {
    return function (x) {
        return f(f(f(x)));
    };
}

function plus1(x) {
    return x + 1;
}

var a = ((twice(thrice))(plus1))(0);
var b = ((thrice(twice))(plus1))(0);
var c = ((twice(twice(thrice)))(plus1))(0);
var d = (((thrice(twice))(thrice))(plus1))(0);
// display(list(a, b, c, d));

// Question 2
// This function returns the second largest element in the given list
function second_largest(lst) {
    var largest_two = accumulate(function (x, accum) {
        return pair(Math.max(x, head(accum), tail(accum)),
                    Math.max(Math.min(x, head(accum)),
                             Math.min(tail(accum))));
    }, pair(-1 / 0, -1 / 0), lst);

    return tail(largest_two);
}

// Question 3
/* Do we exhaoust our resources, time or space?
(function(x) {return x(x);})(function(x) {return x;});
(function(x) {return x(x(x));})(function(x) {return x(x);});
(function(x) {return x(x);})(function(x) {return x(x(x));});

For time, it depends on whether the expansion is infinite.
For space, it depends on whether the deferred operation is infinite.
*/

// Question 4
// Big thinking about hanoi
function move(x, y) {
    display("move from " + x + " to " + y);
}

function hanoi(a, b, c, n) {
    if (n === 1) {
        move(a, b);
    } else {
        hanoi(a, c, b, n - 1);
        move(a, b);
        hanoi(c, b, a, n - 1);
    }
}
// So, what about an iterative version of hanoi?


// Question 5
function permutation(lst) {
    if (is_empty_list(lst)) {
        return list([]);
    } else {
        return accumulate(append, [], map(function (x) {
            return map(function (p) {
                return pair(x, p);
            }, permutation(remove(x, lst)));
        }, lst));
    }
}

function permutation_r(lst, r) {
    if (r === 0) {
        // There is only one way to bild an empty permutation.
        return list([]);
    } else if (is_empty_list(lst)) {
        // There is no way to build a permutation if the list is empty.
        return [];
    } else {
        return accumulate(append, [], map(function (x) {
            return map(function (p) {
                return pair(x, p);
            }, permutation(remove(x, lst), r - 1));
        }, lst));
    }
}

function combination(lst, k) {
    if (k === 0) {
        return list([]);
    } else if (is_empty_list(lst)) {
        return [];
    } else {
        var x = head(lst);
        var with_x = map(function (p) {
            return pair(x, p);
        }, combination(tail(lst), k - 1));
        var without_x = combination(tail(lst), k);

        return append(with_x, without_x);
    }
}

// Question 6
var coins = list(1, 5, 10, 20, 50, 100);

function coin_change(x, values) {
    if (x === 0) {
        return 1;
    } else if (x < 0 || is_empty_list(values)) {
        return 0;
    } else {
        var value = head(values);
        
        return coin_change(x - value, values) +
               coin_change(x, tail(values));
    }
}

// Question 7
function max_path(map) {
    function path(x, y, score) {
        
    }
}

var staff_weight = list(5, 10, 20);
var staff_prices = list(1, 3, 5);

function save_money(weights, values) {
    function 
    }
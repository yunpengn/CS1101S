// CS1101S Discussion Group Week 5
// Implementation of equal function
function one_is_empty(ls1, ls2) {
    return is_empty_list(ls1) || is_empty_list(ls2);
}

function equal(ls1, ls2) {
    if (is_empty_list(ls1) && is_empty_list(ls2)) {
        return true;
    } else if (one_is_empty(ls1, ls2)) {
        return false;
    } else {
        return head(ls1) === head(ls2) ? equal(tail(ls2), tail(ls2)) : false;
    }
}
/*  Question 1
(a) list(list(1, 2, list(3)), list(4, 5), pair(6, 7));
Output: [[1, [2, [[3, []], []]]], [[4, [5, []]], [[6, 7], []]]]
(b) pair(1, list(2, 3, pair(4, [])));
Output: [1, [2, [3, [[4, []], []]]]]
(c) pair(1, pair(2, list(3, list(4, 5))));
Output: [1, [2, [3, [[4, [5, []]], []]]]]
*/

// Question 2
function bad_reverse(lst) {
    if (is_empty_list(lst)) {
        return [];
    } else {
        return pair(bad_reverse(tail(lst)), head(lst));
    }
}
// Test
// draw(bad_reverse(list(1, 2, 3, 4)));
// Why is it incorrect?
// Because the head of a list should be an element instead of another list.

// This function returns the length of a list (the number of elements in it)
function list_length(lst) {
    return is_empty_list(lst) ? 0 : 1 + list_length(tail(lst));
}

// This function returns the nth (starting from 0) element in a guven list
function list_refer(lst, n) {
    if (n < 0 || is_empty_list(lst) || !is_list(lst)) {
        return "invalid";
    } else if (n === 0) {
        return head(lst);
    } else {
        return list_refer(tail(lst), n - 1);
    }
}

// This function returns the last element of a given list
function last_element(lst) {
    return list_refer1(list_length(lst) - 1, lst);
}

// This function excludes the last element of a given list from it.
function exclude_last(lst) {
    if (is_empty_list(lst)) {
        return "Empty list.";
    } else {
        return is_empty_list(tail(lst)) ? []
                                        : pair(head(lst),
                                               exclude_last(tail(lst)));
    }
}

// This function reverses the order of a given list
function list_reverse(lst) {
    function reverse(done, left) {
        return is_empty_list(left) ? done
                                   : reverse(pair(head(left), done),
                                             tail(left));
    }

    return reverse([], lst);
}

// Question 3
var a = list(7, list(6, 5, 4), 3, list(2, 1));
var b = list(list(7), list(6, 5, 4), list(3, 2), 1);
var c = list(7, list(6), list(5, list(4)), list(3, list(2, list(1))));
var d = list(7, list(list(6, 5), list(4), 3, 2), list(list(1)));
/*
(a) head(tail(head(tail(tail(tail(a))))));
(b) head(tail(tail(tail(b))));
(c) head(head(tail(head(tail(head(tail(tail(tail(c)))))))));
(d) head(head(head(tail(tail(d)))));
*/

// Question 4
function every_second(lst) {
    return one_is_empty(lst, tail(lst)) ? []
                                        : list(head(tail(lst)),
                                              every_second(tail(tail(lst))));
}

// Question 5
function sums(lst) {
    function compute(lst, odd, even) {
        if (is_empty_list(lst)) {
            return list(odd, even);
        } else if (is_empty_list(tail(lst))) {
            return list(odd + head(lst), even);
        } else {
            return compute(tail(tail(lst)),
                           odd + head(lst),
                           even + head(tail(lst)));
        }
    }

    return compute(lst, 0, 0);
}

// Question 6
function empty_queue() {
    return [];
}

function enqueue(x, q) {
    return is_empty_list(q) ? list(x)
                            : pair(head(q), enqueue(x, tail(q)));
}
// Order of growth in time:  成(n)
// Order of growth in space: 成(n)

function dequeue(q) {
    return tail(q);
}
// Order of growth in time:  成(1)
// Order of growth in space: 成(1)

function qhead(q) {
    return head(q);
}
// Order of growth in time:  成(1)
// Order of growth in space: 成(1)

var q = enqueue(4, enqueue(5, enqueue(6, empty_queue())));
// draw(q);

// Addtional Problem Set
// Question 1
function make_pairs(xls, yls) {
    return is_empty_list(xls) ? []
                              : pair(pair(head(xls), head(yls)),
                                          make_pairs(tail(xls), tail(yls)));
}

function zip(operate, xls, yls) {
    return is_empty_list(xls) ? []
                              : pair(operate(head(xls), head(yls)),
                                     zip(tail(xls), tail(yls)));
}

// Question 2
// list(list([], 1, list([], 2, [])), 3, list([], 4, []));

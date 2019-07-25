// CS1101S @ NUS SoC
// Final Examination AY2015/2016 Semester 1
// Question 4
function circular_right_shift(arr) {
    var height = arr.length;
    var width = arr[0].length;
    var temp = arr[height - 1][width - 1];
    
    for (var i = 0; i < height; i = i + 1) {
        for (var j = 0; j < width; j = j + 1) {
            var now = arr[i][j];
            arr[i][j] = temp;
            temp = now;
        }
    }
}

// Test
var array_shift = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
circular_right_shift(array_shift);

// Question 5
function mutable_reverse1(xs) {
    if (is_empty_list(xs) || is_empty_list(tail(xs))) {
        return xs;
    } else {
        var temp = mutable_reverse1(tail(xs));
        set_tail(tail(xs), xs);
        set_tail(xs, []);
        return temp;
    }
}

// Test
var list_origin = list(1, 2);
var reversed = mutable_reverse1(list_origin);

function mutable_reverse2(xs) {
    function helper(prev, left) {
        if (is_empty_list(left)) {
            return prev;
        } else {
            var temp = tail(left);
            set_tail(left, prev);
            return helper(left, temp);
        }
    }
    
    return helper([], xs);
}

// Test
var as = list(1, 2, 3, 4, 5);
var bs = mutable_reverse2(as);

// Question 7
var x = stream(2, 4);
var y = stream(3, 5);
var t = stream(x, y);
head(head(t));
head(stream_tail(head(t)));
head(head(stream_tail(t)));
head(stream_tail(head(stream_tail(t))));

function binary_tream(num) {
    return pair(num, function () {
        return pair(binary_tream(num + 1), function () {
            return pair(binary_tream(num * 2), function () {
                return [];
            });
        });
    });
}

var b = binary_tream(1);

function tree_to_tream(tree) {
    if (is_empty_list(tree)) {
        return [];
    } else if (is_list(head(tree))) {
        return pair(tree_to_tream(head(tree)), function () {
            return tree_to_tream(tail(tree));
        });
    } else {
        return pair(head(tree), function () {
            return tree_to_tream(tail(tree));
        });
    }
}

function tream_map(func, tream) {
    if (is_empty_list(tream)) {
        return [];
    } else if (is_pair(head(tream))) {
        return pair(tream_map(func, head(tream)), function () {
            return tream_map(func, stream_tail(tream));
        });
    } else {
        return pair(f(head(tream)), function () {
            return tream_map(func, stream_tail(tream));
        });
    }
}
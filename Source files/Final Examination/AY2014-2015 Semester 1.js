// CS1101S @ NUS SoC
// Final Examination AY2014/2015 Semester 1
// Question 1
function Test(a) {
    this.coco = a;
}

Test.prototype.func = function() {
    function inner() {
        display("B: " + this.coco);
        this.coco = 678;
        display("C: " + this.coco);
    }
    
    display("A: " + this.coco);
    inner();
    display("D: " + this.coco);
};

var test = new Test(123);
// test.func();

// Question 2
function mergeA(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else if (is_empty_list(ys)) {
        return xs;
    } else if (head(xs) <= head(ys)) {
        return pair(head(xs), mergeA(tail(xs), ys));
    } else {
        return pair(head(ys), mergeA(xs, tail(ys)));
    }
}

// Test
var list1 = list(1, 3, 7, 9);
var list2 = list(2, 3, 5, 6, 11);
var merge12 = mergeA(list1, list2);

function mergeB(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else if (is_empty_list(ys)) {
        return xs;
    } else if (head(xs) <= head(ys)) {
        set_tail(xs, mergeB(tail(xs), ys));
        return xs;
    } else {
        set_tail(ys, mergeB(xs, tail(ys)));
        return ys;
    }
}

// Test
var list3 = list(1, 3, 7, 9);
var list4 = list(2, 3, 5, 6, 11, 13);
var merge34 = mergeB(list3, list4);

function mergeC(xs, ys) {
    var result = [];
    var xs_len = xs.length;
    var ys_len = ys.length;
    var result_len = xs_len + ys_len;
    
    var i = 0;
    var j = 0;
    
    while (i + j < result_len) {
        if (i === xs_len) {
            result[i + j] = ys[j];
            j = j + 1;
        } else if (j === ys_len) {
            result[i + j] = xs[i];
            i = i + 1;
        } else if (xs[i] <= ys[j]) {
            result[i + j] = xs[i];
            i = i + 1;
        } else {
            result[i + j] = ys[j];
            j = j + 1;
        }
    }
    
    return result;
}

// Test
var list5 = [1, 3, 7, 9];
var list6 = [2, 3, 5, 6, 11, 13];
var merge56 = mergeC(list5, list6);

// Question 3
function are_equal_sets(a, b) {
    return accumulate(function (x, accum) {
        return accum && !is_empty_list(filter(function (p) {
            return p === x;
        }, b));
    }, true, a);
}

// Test
var x1 = list(1, 2, 3);
var x2 = list(3, 2, 1);
// are_equal_sets(x1, x2);
var y1 = list(1, 2, 4);
var y2 = list(2, 1, 3);
// are_equal_sets(y1, y2);
var z1 = list(1, 2, 5);
var z2 = list(2, 1);
// are_equal_sets(z1, z2);

function power_set(xs) {
    if (is_empty_list(xs)) {
        return list([]);
    } else {
        var without_x = power_set(tail(xs));
        var with_x = map(function (x) {
            return pair(head(xs), x);
        }, without_x);
        
        return append(without_x, with_x);
    }
}

// Test
var my_set = list(1, 2, 3);
var my_power_set = power_set(my_set);

// Question 4
function make_circular_copy(xs) {
    function helper(zs, ys) {
		if (is_empty_list(zs)) {
			return ys;
		} else {
			return pair(head(zs), helper(tail(zs), ys));
		}
	}
	
	if (is_empty_list(xs)) {
	    return [];
	} else {
	    var ys = pair(head(xs), []);
	    set_tail(ys, helper(tail(xs), ys));
	    return ys;
	}
}

function make_circular_copy_alter(xs) {
    function helper(lst) {
        if (is_empty_list(tail(lst))) {
            set_tail(lst, ys);
        } else {
            helper(tail(lst));
        }
    }
    
    if (is_empty_list(xs)) {
        return [];
    } else {
        var ys = map(function (x) {
            return x;
        }, xs);
        helper(ys);
        
        return ys;
    }
}

// Test
var origin = list(1, 2, 3);
var circular_copy = make_circular_copy(origin);
// list_ref(circular_copy, 5);

function make_linear(xs) {
    function helper(lst) {
        if (tail(lst) === xs) {
            set_tail(lst, []);
        } else {
            helper(tail(lst));
        }
    }
    
    if (is_empty_list(xs)) {
        ;
    } else {
        helper(xs);
    }
}

// Test
var linear_circular = make_circular_copy(origin);
make_linear(linear_circular);
// linear_circular;
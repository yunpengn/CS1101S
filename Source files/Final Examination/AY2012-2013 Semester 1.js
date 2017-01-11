// CS1101S @ NUS SoC
// Final Examination AY2012/2013 Semester 1
// Question 2
function make_bigInt(sign, digits) {
	return {tag: "bigInt",
			sign: sign,
			digits: digits};
}

function get_sign(bigInt) {
	return bigInt.sign;
}

function get_digits(bigInt) {
	return bigInt.digits;
}

function digit_sum(bigInt) {
	return accumulate(function (x, accum) {
		return x + accum;
	}, 0, get_digits(bigInt));
}

function bigInt_to_int(bigInt) {
	return (get_sign(bigInt) === "+" ? 1 : -1) *
		   accumulate(function (x, accum) {
		   	   return accum * 10 + x;
		   }, 0, reverse(get_digits(bigInt)));
}

function align(xs ,ys) {
	function zip_them(xs ,ys) {
		if ( is_empty_list (xs) || is_empty_list (ys)) {
			return [];
		} else {
			return pair(pair(head(xs), head(ys)),
				        zip_them(tail(xs),tail(ys)));
		}
	}

	var lxs = length(xs);
	var lys = length(ys);
	var zeros = build_list(Math.abs(lxs - lys), function(x) {
		return 0;
	});
	
	var newxs = (lxs < lys) ? append(zeros, xs) : xs;
	var newys = (lxs > lys) ? append(zeros, ys) : ys;

	return zip_them(newxs, newys);
}

function add_bigInt(a, b) {
    var value = accumulate(function (x, accum) {
        var sum = head(x) + tail(x) + tail(accum);
        var current = sum % 10;
        var carry = Math.floor(sum / 10);
        
        return pair(pair(current, head(accum)), carry);
    }, pair([], 0), align(get_digits(a), get_digits(b)));
    
    var convert = tail(value) === 0 ? head(value)
                                    : pair(tail(value), head(value));
    
    return make_bigInt("+", convert);
}

// Test
var x = make_bigInt("+", list(8, 7, 6));
var y = make_bigInt("-", list(2, 0, 5));
var z = add_bigInt(x, y);

// Question 3
function is_sorted(xs) {
    return length(xs) <= 1 ? true
                           : head(xs) <= head(tail(xs)) && 
                             is_sorted(tail(xs));
}

function permutations(s) {
    if (is_empty_list(s)) {
        return list([]);
    } else {
        return accumulate(append, [], map(function (x) {
            return map(function (p) {
                return pair(x, p);
            },permutations(remove(x, s)));
        }, s));
    }
}

function sort(xs) {
    return head(filter(function (x) {
        return is_sorted(x);
    }, permutations(xs)));
}

function all_subsequences(xs) {
    if (is_empty_list(xs)) {
        return list([]);
    } else {
        return accumulate(append, [], map(function (x) {
            return map(function (p) {
                return pair(x, p);
            }, all_subsequences(remove(x, xs)));
        }, xs));
    }
}

function longest_subsequence_length(xs, ys) {
    if (is_empty_list(xs) || is_empty_list(ys)) {
        return 0;
    } else if (head(xs) === head(ys)) {
        return 1 + longest_subsequence_length(tail(xs), tail(ys));
    } else {
        return Math.max(longest_subsequence_length(xs, tail(ys)),
                        longest_subsequence_length(tail(xs), ys));
    }
}

// Test
var list1 = list(1, 2, 6, 1, 3, 1, 4, 1, 2, 6, 1);
var list2 = list(7, 1, 2, 2, 1, 4, 1, 2, 2, 1, 4, 5, 5);
longest_subsequence_length(list1, list2);
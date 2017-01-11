// CS1101S @ NUS AY2016-2017 Semester 1
// Discussion Group Week 11

// Question 1
function scale_stream(c, stream) {
    return stream_map(function (x) { return c * x; }, stream);
}

var A = pair(1, function () { return scale_stream(2, A); });
// eval_stream(A, 10);  // 2 in power of n stream

function mul_streams(a, b) {
    return pair(head(a) * head(b),
    function () {
        return mul_streams(stream_tail(a), stream_tail(b));
    });
}

var integers = integers_from(1);
var B = pair(1, function () { return mul_streams(B, integers); });
// eval_stream(B, 10);  // factorial stream

// Question 2
function stream_pairs(s) {
    if (is_empty_list(s)) {
        return [];
    } else {
        return stream_append(stream_map(function (sn) {
            return list(head(s), sn);
        }, stream_tail(s)),
        stream_pairs(stream_tail(s)));
    }
}

var ints = stream(1, 2, 3, 4, 5);
var s1 = stream_pairs(ints);
// eval_stream(s1, 10);

function stream_append_origin(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else {
        return pair(head(xs), function () {
            return stream_append_origin(stream_tail(xs), ys);
        });
    }
}

function stream_append_pickle(xs, ys) {
    if (is_empty_list(xs)) {
        return ys();
    } else {
        return pair(head(xs), function () {
            return stream_append_pickle(stream_tail(xs), ys);
        });
    }
}

function stream_pairs2(s) {
    if (is_empty_list(s)) {
        return [];
    } else {
        return stream_append_pickle(stream_map(function (sn) {
            return list(head(s), sn);
        }, stream_tail(s)),
        function () {
            return stream_pairs2(stream_tail(s));
        });
    }
}

var s2 = stream_pairs2(integers);
// eval_stream(s2, 20);

function stream_pairs3(s) {
    function stream_pair_till(n) {
        var now = list_to_stream(map(function (x) {
            return pair(x, n);
        }, enum_list(1, n - 1)));

        return stream_append_pickle(now, function () {
            return stream_pair_till(n + 1);
        });
    }

    return stream_pair_till(2);
}

var s3 = stream_pairs3(integers);
// eval_stream(s3, 30);

// Question 3
function add_streams(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(head(s1) + head(s2), function () {
            return add_streams(stream_tail(s1), stream_tail(s2));
        });
    }
}

function scale_stream(c, stream) {
    return stream_map(function (x) {
        return c * x;
    }, stream);
}

var add_series = add_streams;
var scale_series = scale_stream;

function negate_series(s) {
    return scale_stream(-1, s);
}

function subtract_series(s1, s2) {
    return add_series(s1, negate_series(s2));
}

function coeffs_to_series(list_of_coeffs) {
    var zeros = pair(0, function () {
        return zeros;
    });

    function iter(list) {
        if (is_empty_list(list)) {
            return zeros;
        } else {
            return pair(head(list), function () {
                return iter(stream_tail(list));
            });
        }
    }

    return iter(list_of_coeffs);
}

function fun_to_series(fun) {
    var non_neg_integers = integers_from(0);

    return stream_map(fun, non_neg_integers);
}

function ones() {
    return pair(1, ones);
}

var ones_stream = ones();
// or can directly use var ones = pair(1, function () { return ones; });
// eval_stream(ones_stream, 10);

function alt_ones1() {
    return pair(1, function () {
        return (negate_series(alt_ones1()));
    });
}

var alt_ones1_stream = alt_ones1();
// eval_stream(alt_ones1_stream, 10);

function alt_ones2() {
    return stream_map(function (x) {
        return x % 2 === 0 ? 1 : -1;
    }, integers_from(0));
}

var alt_ones2_stream = alt_ones2();
// eval_stream(alt_ones2_stream, 10);

function alt_ones3(reference) {
    return pair(reference, function () {
        return alt_ones3(-reference);
    });
}

var alt_ones3_stream = alt_ones3(1);
// eval_stream(alt_ones3_stream, 10);

function alt_ones4() {
    return pair(1, pair(-1, function () {
        return alt_ones4();
    }));
}

var alt_ones4_stream = alt_ones4();
// eval_stream(alt_ones4_stream, 10);

function zeros1() {
    return pair(0, zeros1);
}

var zeros1_stream = zeros1();
// eval_stream(zeros1_stream, 10);

function zeros2(alt_ones) {
    return pair(head(alt_ones) + head(stream_tail(alt_ones)), function () {
        return zeros2(stream_tail(stream_tail(alt_ones)));
    });
}

var zeros2_stream = zeros2(alt_ones1_stream);
// eval_stream(zeros2_stream, 10);

function zeros3() {
    var alt_ones = alt_ones4_stream;
    return add_streams(alt_ones, stream_tail(alt_ones));
}


var S1 = ones_stream;
var S2 = integers;

// Question 4
function mul_series(s1, s2) {
    return pair(head(s1) * head(s2), function () {
        return add_series(scale_series(head(s2), stream_tail(s1)),
                          mul_series(s1, stream_tail(s2)));
    });
}

// Test
var S2_alter = mul_series(S1, S1);
// eval_stream(S2_alter, 10);

// Question 5
// The inverse of S is the power series X such that S · X = 1.
function invert_unit_series(s) {
    var sr = stream_tail(s);
    var x = pair(1, function () {
        return negate_series(mul_series(sr, x));
    });
    
    return x;
}

// Test
var S1_reciprocal = invert_unit_series(S1);
// eval_stream(S1_reciprocal, 10);
// The result is [1, [-1, [0, [0, [0, [0, [0, [0, [0, [0, []]]]]]]]]]]

// Verify
var S1_back = mul_series(S1, S1_reciprocal);
// eval_stream(S1_back, 10);
// The result is [1, [0, [0, [0, [0, [0, [0, [0, [0, [0, []]]]]]]]]]]

// Question 6
// Pre-condition: denominator series begins with a nonzero constant term.
function div_series(s1, s2) {
    var a = head(s2);

    return mul_series(scale_series(1 / a,
                        invert_unit_series(scale_series(1 / a, s2))), s1);
}

// Test
var S3 = integers_from(2);
var S4 = div_series(S1, S3);
var S5 = mul_series(S3, S4);
// eval_stream(S5, 10);
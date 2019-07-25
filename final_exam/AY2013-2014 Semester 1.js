// CS1101S @ NUS SoC
// Final Examination AY2013/2014 Semester 1
// Question 3
// Pre-condition: The input is not equal to 0
function is_power_of_2(n) {
	var x = Math.log2(n);
	return Math.floor(x) === x;
}

// Test
is_power_of_2(2);
is_power_of_2(16);
is_power_of_2(0);   // This is a bug when n === 0
is_power_of_2(1 / 2);
is_power_of_2(0.3);

function number_of_teams_playing(n) {
    return Math.pow(2, Math.floor(Math.log2(n)));
}

// Test
number_of_teams_playing(15);
number_of_teams_playing(16);

// Question 4
var a = 1;
function test() {
    return a + 2;
}

var a = 3;

// Question 5
function merge(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(head(s1), function () {
            return pair(head(s2), function () {
                return merge(stream_tail(s1), stream_tail(s2));
            });
        });
    }
}

function merge_better(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else {
        return pair(head(s1), function () {
            return merge(s2, stream_tail(s1));
        });
    }
}

// Test
var r1 = integers_from(1);
var r2 = integers_from(1);
var r12 = merge(r1, r2);
// eval_stream(r12, 10);

var r3 = integers_from(-100);
var r123 = merge(r12, r3);
// eval_stream(r123, 20);

function merge_streams(ss) {
    if (is_empty_list(ss)) {
        return [];
    } else if (is_empty_list(head(ss))) {
        return merge_streams(tail(ss));
    } else {
        return pair(head(head(ss)), function () {
            return merge_streams(append(tail(ss),
                                 list(stream_tail(head(ss)))));
        });
    }
}

// Test
var rs = list(r1, r2, r3);
var rss = merge_streams(rs);
// eval_stream(rss, 20);
//==========================================================

function memo_fun(f) {
    var already_run = false;
    var result = 0;
    return function() {
        if (!already_run) {
            result = f();
            already_run = true;
            return result;
        } else {
            return result;
        }
    };
}

function add_streams(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(head(s1) + head(s2),
                    function() { 
                        return add_streams(stream_tail(s1), stream_tail(s2)); 
                    });
    }
}

function mul_streams(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(head(s1) * head(s2),
                    function() { 
                        return mul_streams(stream_tail(s1), stream_tail(s2)); 
                    });
    }
}

function scale_stream(s, f) {
    return stream_map(function(x) { return x * f; }, s);
}

function display_stream(s) {
    return stream_for_each(display, s);
}

function show(x) {
    display(x);
    return x;
}

function integers_from(n) {
    return pair(n, function () {
        return integers_from(n + 1);
    });
}

var integers = integers_from(1);
var ones = pair(1, function() { return ones; });


//==========================================================

function is_divisible(x, y) {
    return x % y === 0;
}

var no_fours =
        stream_filter(
            function(x) {
                return !is_divisible(x, 4);
            },
            integers);

// stream_ref(no_fours, 3);
// stream_ref(no_fours, 100);
// eval_stream(no_fours, 10);


//==========================================================

function fibgen(a, b) {
    return pair(a,
                function() { 
                    return fibgen(b, a + b);
                });
}

var fibs = fibgen(0, 1);

// eval_stream(fibs, 10);


//==========================================================

function helper(a, b) {
    if (a > b) {
        return helper(1, 1 + b);
    } else {
        return pair(a,
                    function() {
                        return helper(a + 1, b);
                    });
    }
}

var more_and_more = helper(1, 1);

// eval_stream(more_and_more, 10);


//==========================================================

function replace(s, a, b) {
  return pair((head(s) === a) ? b : head(s),
              function() {
                return replace(stream_tail(s), 
                                a, b);
              });
}

var more_and_more2 = replace(more_and_more, 1, 0);

// eval_stream(more_and_more2, 10);


//==========================================================

var rep123 =
        pair(1,
             function() {
               return pair(2,
                           function() {
                             return pair(3,
                                         function() {
                                           return rep123;
                                         });
             });           });

// eval_stream(rep123, 10);


//==========================================================

var fibs2 =
        pair(0,
          function() {
            return pair(1,
                     function() {
                       return add_streams(
                                stream_tail(fibs2),
                                fibs2);
                     });
          });

// eval_stream(fibs2, 10);


//==========================================================

var integers2 =
        pair(1, function() {
                  return add_streams(ones, integers2);
                });

// eval_stream(integers2, 10);



//==========================================================
// TESTING MEMOIZED STREAMS

var onesA = pair(1, function() { display("A"); return onesA; });
// stream_ref(onesA, 3);

var onesB = pair(1, memo_fun(function() { display("B"); return onesB; }));
// stream_ref(onesB, 3);


//==========================================================
// TESTING MEMOIZED STREAMS

function m_integers_from(n) {
  return pair(n, 
              memo_fun(
                function() { 
                  display("M: " + n); 
                  return m_integers_from(n + 1); 
                }));
}

var m_integers = m_integers_from(1);

// stream_ref(m_integers, 0);
// stream_ref(m_integers, 1);
// stream_ref(m_integers, 2);
// stream_ref(m_integers, 5);
// stream_ref(m_integers, 5);
// stream_ref(m_integers, 5);


//==========================================================

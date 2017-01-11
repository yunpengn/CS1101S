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

function partial_sums(s) {
    return pair(head(s),
                function() {
                    return add_streams(stream_tail(s),
                                       partial_sums(s));
                });
}

function scale_stream(s, f) {
    return stream_map(function(x) { return x * f; }, s);
}


function is_divisible(x, y) {
    return (x % y === 0);
}

function square(x) {
    return x * x;
}



//==========================================================
//==========================================================
// Generating Primes

var primes = pair(2, function() {
                         return stream_filter(is_prime,
                                       integers_from(3));
                     });

function is_prime(n) {
    function iter(ps) {
        if (square(head(ps)) > n) {
            return true;
        } else if (is_divisible(n, head(ps))) {
            return false;
        } else {
            return iter(stream_tail(ps));
        }
    }
    return iter(primes);
}

// eval_stream(primes, 10);


//==========================================================
//==========================================================
// Sieve of Eratosthenes

function sieve(s) {
   return pair(head(s), function() {
       return sieve(stream_filter(function(x) {
           return !is_divisible(x, head(s));
       }, stream_tail(s)));
   });
}

var primes2 = sieve(integers_from(2));

// eval_stream(primes2, 10);


//==========================================================
//==========================================================
// Square Roots by Newton’s Method

function average(a, b) {
    return (a + b) / 2;
}

function improve(guess, x) {
    return average(guess, x / guess);
}

function sqrt_iter(guess, x) {
    if (good_enough(guess, x)) {
        return guess;
    } else {
        return sqrt_iter(improve(guess, x), x);
    }
}

function sqrt(x) {
    return sqrt_iter(1.0, x);
}

function sqrt_stream(x) {
    var guesses =
    pair(1.0,
         function() {
             return stream_map(
                 function(guess) {
                     return improve(guess, x);
                 },
                 guesses);
         });

    return guesses;
}

// eval_stream(sqrt_stream(2), 6);


//==========================================================
//==========================================================
// Approximating Pi with Alternating Series

function pi_summands(n) {
    return pair(1 / n, function() {
        return stream_map(function(x) { return -x; }, pi_summands(n + 2));
    });
}

var pi_stream = scale_stream(partial_sums(pi_summands(1)), 4);

// eval_stream(pi_stream, 8);


//==========================================================
//==========================================================
// Euler’s Sequence Accelerator

function euler_transform(s) {
    var s0 = stream_ref(s, 0);  // S_n-1
    var s1 = stream_ref(s, 1);  // S_n
    var s2 = stream_ref(s, 2);  // S_n+1
    var sprime = s2 - square(s2 - s1) / (s0 - 2 * s1 + s2);
    return pair(sprime, 
                function() {
                    return euler_transform(stream_tail(s));
                });

//      return pair(sprime, 
//                  memo_fun(function() {
//                      return euler_transform(stream_tail(s));
//                  }));
}


var euler_pi_stream = euler_transform(pi_stream);

// eval_stream(euler_pi_stream, 8);


//==========================================================
//==========================================================
// Even More Acceleration

var accel_pi_stream = euler_transform(
    euler_transform(euler_transform(
    euler_transform(euler_transform(pi_stream)))));

// eval_stream(accel_pi_stream, 8);


//==========================================================
//==========================================================
// Infinite Streams of Pairs

function interleave(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else {
        return pair(head(s1), 
                    function() {
                        return interleave(s2,                        
                                    stream_tail(s1));
                    });
    }
}

function pairs(s, t) {
  return pair(
    pair(head(s), head(t)), 
    function() {
      var st1 = stream_map(function(x){
                             return pair(head(s), x);  
                           },
                           stream_tail(t));
      var st2 = pairs(stream_tail(s), stream_tail(t));
      return interleave(st1, st2);
    });
}

var int_pairs = pairs(integers_from(1), integers_from(1));

// eval_stream(int_pairs, 10);
function factorial(n) {
    return n === 0 ? 1
                   : n * factorial(n - 1);
}

function compose(f, g) {
    return function(x) { return f(g(x)); };
}

/*
var squared_factorial =
compose(square, factorial);
squared_factorial(3);
*/

function repeated(f, n) {
    return n === 0 ? function(x) { return x; }
                   : compose(f, repeated(f, n - 1));
}

function power_repeated(b, e) {
    return (repeated(function(x) { return b * x; },e))(1);
}

/*
power_repeated(3,4);
*/

function sum_numbers(a, b) {
    return (a > b) ? 0 : a + sum_numbers(a + 1, b);
}

/*
sum_numbers(0,5);
*/


function cube(x) {
    return x * x * x;
}
function sum_cubes(a, b) {
    return (a > b) ? 0 
                   : cube(a) + sum_cubes(a + 1, b);
}

/*
sum_cubes(0,5);
*/

function sum(term, a, next, b) {
    return (a > b) ? 0
                   : term(a) +
                     sum(term, next(a), next, b);
}

/*
sum(function(x) { return cube(x);},
    0,
    function(x) { return x + 1;},
    5);
*/
    

function fold(op, term, n) {
    return (n === 0) ? term(0)
                     : op(term(n), fold(op, term, n - 1));
}

function fold(op, term, n) {
    return (n === 0) ? term(0)
                     : op(term(n), fold(op, term, n - 1)); }
function power_fold(b, e) {
    return fold(function(x, y) { return x * y; },
                function(x) { return b; },
                e - 1);
}

/*
power_fold(3,4);
*/


function factorial_fold(n) {
    return fold(function(x, y) { return x * y; },
                function(x)    { return x + 1; },
                n - 1);
}

/*
factorial_fold(4);
*/

function comb(op, term, a, next, b, base) {
    return (a > b) ? base
                   : op(term(a), 
                        comb(op, term, next(a), 
                             next, b, base));
}


function factorial_comb(n) {
    return comb(function(x, y) { return x * y; },
                function(x)    { return x; },
                1,
                function(x)    { return x + 1; },
                n,
                1);
}

/*
factorial_comb(4);
*/


/*
(draw_connected(200))(unit_line);

(draw_connected_squeezed_to_window(200))(unit_line);


(draw_connected(200))(unit_circle);


(draw_connected_squeezed_to_window(200))(unit_circle);
*/

function draw(c) {
    return (draw_connected_squeezed_to_window(2000))(c);
}

function spiral_one(t) {
    var p = unit_circle(t);
    return make_point(t * x_of(p), 
                      t * y_of(p));
}

/*
(draw(spiral_one);
*/


function spiral(rev) {
    return function(t) {
               var p = unit_circle(t * rev);
               return make_point(t * x_of(p),
                                 t * y_of(p));
            };
}



/* 
draw(spiral(17));
*/

function doodle(rev) {
    return connect_rigidly(
               function(t) {
                   var p = unit_circle((t * rev) );
                   return make_point( t * t * x_of(p) -  y_of(p),
                                      t * t * y_of(p) - x_of(p));
                },
                function(t) {
                   var p = unit_circle((t * rev) );
                   return make_point( t * t * x_of(p) + y_of(p),
                           t*t * y_of(p) +  x_of(p));
                } 
               );
}

/* 
draw(doodle(17));
*/

function spiralize(rev) {
    return function(c) {
               return function(t) {
                          var p = c(t * rev);
                          return make_point(t * x_of(p),
                                            t * y_of(p));
                      };
           };
}

function unit_square(t) {
    var ft = t - Math.floor(t);
    if (ft < 0.25) {
        return make_point(2 * ft-1, -1);
    } else if (ft < 0.5) {
        return make_point(1, 2 * (ft-0.25) - 1);
    } else if (ft < 0.75) {
        return make_point(1-2*(ft-0.5), 1);
    } else {
        return make_point(-1, 1-2*(ft-0.75));
    }
}
    

/*

draw( (spiralize(16))(unit_circle) );
 
draw( (spiralize(16))(unit_square) );

draw(
 (spiralize(17))
   ( (spiralize(16))(unit_circle) )
   );

*/


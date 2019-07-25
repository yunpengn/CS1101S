// Question 1
function pascel(row, column) {
    if (column === 1 || column === row) {
        return 1;
    } else {
        return pascel(row - 1, column - 1) + pascel(row - 1, column);
    }
}

// Question 2
function coin_change(x) {
    function compute(amount, kind) {
        if (amount === 0) {
            return 1;
        } else if (amount < 0 || kinds === 0) {
            return 0;
        } else {
            return compute(amount, kind - 1) +
                   compute(amount - values(kind), kind);
        }
    }

    return compute(x, 5);
}

function values(kind) {
    if (kind === 1) {
        return 50;
    } else if (kind === 2) {
        return 20;
    } else if (kind === 3) {
        return 10;
    } else if (kind === 4) {
        return 5;
    } else {
        return 1;
    }
}

// Order of growth in time:  жи(n ^ kind)
// Order of growth in space: жи(n)
/*
Doubt: Why the time complexity is not жи(kind ^ n)?
Because the data structure is not a traversa1 tree. If there is only 1 kind,
the data structure is 1D line, so time complexity is n; if there are 2 kinds,
the data structure is 2D triangle, so time compleity is n^2; so on and so
forth, if there are n kinds, the time complexity is n^kind.
*/
// Question 3
function f1(n) {
    return n < 3 ? n : f1(n - 1) + 2 * f1(n - 2) + 3 * f1(n - 3);
}

function f2(x) {
    function iter(last1, last2, last3, n) {
        return n > x ? last1 : iter(last1 + 2 * last2 + 3 * last3,
                                    last1, last2, n + 1);
    }

    return x < 3 ? x : iter(2, 1, 0, 3);
}

// Question 4
function f(g) {
    return g(4);
}
// f(f);

// Quesion 5
function compose(f, g) {
    return function (x) {
        return f(g(x));
    };
}

function identity(x) {
    return x;
}

function sqr(x) {
    return x * x;
}
function add1(x) {
    return x + 1;
}
function thrice(x) {
    return compose(compose(x, x), x);
}
// n === 9
// (a) 27
// (b) compose
// (c) 1
// (d) 2^(2^27)

// Addtional Problem Set
// Question 1
function myfunc(a, b, c) {
    return a * b + c;
}
function new_func(a) {
    return function (b) {
        return function (c) {
            return a * b + c;
        }
    }
}
// ((new_func(a))(b))(c)

// Question 2
// 2 * 2 * plus_one(4 * x)
// 4 * (4 + 1) = 20

// Question 3
// This program exhausts all time resources and all space resources.
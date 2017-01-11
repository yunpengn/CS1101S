// 1 Abstraction
// Problem 1
function square_sum_larger_two(a, b, c) {
    function square(x) {
        return x * x;
    }

    function square_sum(x, y) {
        return square(x) + square(y);
    }

    return square_sum(Math.max(a, b), Math.max(Math.min(a, b), c));
}

// Problem 2
function is_leap_year(year) {
    return year % 4 === 0 && year % 100 !== 0 && year % 400 === 0;
}

// 2 Order of growth
// Problem 1
/* Let n > n0 > 1, so n^2 > n > 1
   Then, 4n^2 - n^2 < 4n^2 - n < 4n^2
   k1 = 3, k2 = 4
*/

// Problem 2
/* Give a counterexample as follows:
   Let n = 9 > n0
   Then, 10nlogn = 90log9 =85.88
         n^2 = 81
         10nlogn > n^2
    So, his claim is wrong.
*/

// Problem 3
// It is correct technically, but not good enough.


// Problem 4
/* 成(n^2)
   成(n)
   成(n^2 * 3^n)
*/

// Problem 5
// Order of growth for time:  成(n)
// Order of growth for space: 成(n)

// Problem 6
function fact2(n) {
    function compute(product, count) {
        return count === 1 ? product
                           : compute(product * count, count - 1);
    }
    return compute(1, n);
}
// Order of growth for time:  成(n)
// Order of growth for space: 成(1)

// Addtional Problem Set - Recursion
// Problem 1
// Version 1: Recursive process
function sum_of_digits1(x) {
    function compute(n) {
        return x === 0 ? 0
                       : n % 10 + sum_of_digits1(Math.floor(n / 10));
    }
    return compute(Math.abs(x));
}

// Version 2: Iterative process
function sum_of_digits2(x) {
    function compute(n, sum) {
        return n === 0 ? sum
                       : compute(Math.floor(n / 10), sum + n % 10);
    }

    return compute(Math.abs(x), 0);
}

// Version 3: Recursive process
// This function may seem weird, but actually it gives the correct answer.
// think about it!
function sum_of_digits3(x) {
    function compute(n) {
        return x === 0 ? 0
                       : n % 10 + Math.floor(sum_of_digits3(n / 10));
    }
    return compute(Math.abs(x));
}

// Problem 2
function is_multiple_of_nine(x) {
    return x < 10 ? (x === 9) : is_multiple_of_nine(sum_of_digits2(x));
}

// Problem 3
// Inspired by coin_change function
function staircase(x) {
    function compute(block, height) {
        if (block === 0) {
            return 1;
        } else if (block < 0 || height === 0) {
            return 0;
        } else {
            return compute(block - height, height - 1) +
                   compute(block, height - 1);
        }
    }

    return compute(x, x);
}

// Addtional Problem Set - Iteration
// Problem 1
function f_iter(n) {
    function compute(last1, last2, last3, count) {
        return count > n ? last1
                         : compute(last1 + 2 * last2 + 3 * last3,
                                   last1, last2, count + 1);
    }
    return n < 3 ? n : compute(2, 1, 0, 3);
}

// Addtional Problem Set - Order of growth
// Problem 1
// Order of growth for time:  成(n)
// Order of growth for space: 成(1)

// Problem 2
// Order of growth for time:  成(log(n))
// Order of growth for space: 成(1)

// Problem 3
// Order of growth for time:  成(2^n)
// Order of growth for space: 成(n)

// Problem 4
// Order of growth for time:  成(sqrt(n))
// Order of growth for space: 成(1)

// Problem 5
// Order of growth for time:  成(1)
// Order of growth for space: 成(1)

// Problem 6
// Order of growth for time:  成(n / log(n))
// Order of growth for space: 成(1)

// Problem 7
// Order of growth for time:  成(n)
// Order of growth for space: 成(log(n))

// Problem 8
// Order of growth for time:  成(2^n)
// Order of growth for space: 成(n)

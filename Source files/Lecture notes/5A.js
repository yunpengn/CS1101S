var p = pair(1, 2); // forms a pair
head(p); // accesses first component
tail(p); // accesses second component

var xs =
pair(1,
     pair(2,
          pair(3,
               pair(4, []))));

draw(xs);


// Limit of continuous range of representation:
Math.pow(2,53); // 9007199254740992

Math.pow(2,53) + 1; // 9007199254740992

// (show the number in http://www.binaryconvert.com/result_double.html)
// One less is also interesting
Math.pow(2,53) - 1; // 9007199254740991

// Zhan Yu entered really large number:
123456789012345678901;
// and saw it truncated to 123456789012345680000

1 / 5 + 2 / 5 === 3 / 5; // false
1 / 5 + 1 / 5 + 1 / 5 === 3 / 5; // false
1 / 5 + 1 / 5 === 2 / 5; // true

// Pentium bug in float 
4195835 / 3145727; //  1.333820449136241
// buggy Pentiums gave 1.333739068902036



function length(xs) {
return is_empty_list(xs)
? 0
: 1 + length(tail(xs));
}


function length_iter(xs) {
    function len(xs, counted_so_far) {
        return is_empty_list(xs)
               ? counted_so_far
               : len(tail(xs),
                     counted_so_far + 1);
    }
    return len(xs, 0);
}



var list1 = list(1,2,3);
var list2 = list(4,5,6);

// what we want is
var list3 = list(1,2,3,4,5,6);

function append(xs, ys) {
    return is_empty_list(xs)
           ? ys
           : pair(head(xs),
                 append(tail(xs), ys));
}

function reverse1(lst) {
    return is_empty_list(lst)
           ? []
           : pair(reverse1(tail(lst)),
                  head(lst));
}

function reverse(lst) {
    return is_empty_list(lst)
           ? []
           : append(reverse(tail(lst)),
                    list(head(lst)));
}

function reverse_iter(xs) {
    function rev(original, reversed) {
        return is_empty_list(original)
               ? reversed
               : rev(tail(original),
                     pair(head(original),
                     reversed));
    }
    return rev(xs,[]);
}

function scale_list(items, factor) {
    return is_empty_list(items)
           ? []
           : pair(factor * head(items),
                  scale_list(tail(items),
                            factor)
                 );
}

function square(x) { return x * x; }

function square_list(items) {
    return is_empty_list(items)
           ? []
           : pair(square(head(items)),
                  square_list(tail(items))
                 );
}

function map(fun, items) {
    return is_empty_list(items)
           ? []
           : pair(fun(head(items)),
                  map(fun, tail(items)));
}

var tree = pair(list(1, 2), list(3, 4));

function count_leaves(tree) {
    return is_empty_list(tree)
           ? 0
           : (is_list(head(tree))
             ? count_leaves(head(tree))
             : 1)
             +
             count_leaves(tail(tree));
}


function scale_tree1(tree, factor) {
    return map(function(sub_tree) {
                   return ! is_list(sub_tree)
                          ? factor * sub_tree
                          : scale_tree1(sub_tree,
                                        factor);
               },
               tree);
}

function map_tree(f, tree) {
    return map(function(sub_tree) {
                   return ! is_list(sub_tree)
                          ? f(sub_tree)
                          : map_tree(f, sub_tree);
               },
               tree
              );
}

function scale_tree(tree, factor) {
    return map_tree(function(leaf) {
                        return leaf * factor;
                    },
                    tree);
}

// signal processing metaphor

function is_even(x) { return x % 2 === 0; }
function plus(x, y) { return x + y; }

var squares = build_list(10, square);
var even_squares = filter(is_even, squares);
var half_even_squares
= map(function(x) { return x / 2; },
even_squares);
var result = accumulate(plus,0,half_even_squares);

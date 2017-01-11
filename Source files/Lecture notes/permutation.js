/*
Aim: To obtain the set of all permutations of S
Strategy: 
1. For every X, find all permutations of S - X and put X in front of each one 
of them to get all permutations of S which starts with X. 
2. The union of all these subsets gives us the set of all permutations of S.
function permutations 
*/

function permutations(s) {
    if (is_empty_list(s)) {
        return list([]);  // Base case
        // There is only 1 permutation of the empty set, which is itself.
    } else {
        var put_x_in_front = function (x, permutations_list) {
            //pair element to every list within permutations_list
            return map(function (permutation) {
                return pair(x, permutation);
            }, permutations_list);
        };

        //This function takes in a list s, and returns, for every element x, a list whose 
        // every element is a list of permutations of s with x being the first element
        var replace_every_x_with_permutations_list = function (s) {
            return map(function (x) {
                //get all permutations of S - X (wishful thinking!)
                var list_of_permutations_without_x = permutations(remove(x, s));

                //put X in front of every permutation of S - X 
                var list_of_permutations_with_x_at_front = put_x_in_front(x, list_of_permutations_without_x);
                return list_of_permutations_with_x_at_front;
            }, s);
        };

        var list_of_list_of_permutations = replace_every_x_with_permutations_list(s);
        //every element in our list_of_list_of_permutations is a list of permutations of s
        // so we can just append them all together and return the result
        return accumulate(append, [], list_of_list_of_permutations);
    }
}
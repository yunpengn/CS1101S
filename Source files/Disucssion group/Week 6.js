// CS1101S @ NUS AY2016-2017 Semester 1
// Discussion Group Week 6
// Pre-class quesitons
function map_by_accum(op, lst) {
    return accumulate(function (x, y) {
        return pair(op(x), y);
    }, [], lst);
}

function filter_by_accum(check, lst) {
    return accumulate(function (x, accum) {
        return check(x) ? pair(x, accum) : accum;
    }, [], lst);
}

// Question 1
function remove_duplicates0(lst) {
    function helper(total, encountered, remain) {
        if(is_empty_list(remain)) {
            return total;
        } else {
            var x = head(remain);
            if(is_empty_list(member(encountered))) {
                return helper(pair(x, total),
                              pair(x, encoutered), tail(remain));
            } else {
                return helper(total, encountered, tail(remain));
            }
        }
    }
    
    return helper([], [], lst);
}

function remove_duplicates1(lst) {
    if (is_empty_list(lst)) {
        return lst;
    } else {
        var x = head(lst);
    
        return pair(x,
                    remove_duplicates1(filter(function (x) {
                        return x !== y;
                    }, lst)));
    }
}

function remove_duplicates2(lst) {
    return accumulate(function (x, accum) {
        return is_empty_list(member(x, accum)) ? pair(x, accum) : accum;
    }, [], lst);
}

// Question 2
function makeup_amount(x,lst) {
    if (is_pair(lst)) {
        var current = head(lst);
        var with_current = map(function (lst) { return pair(current, lst); },
                               makeup_amount(x - h, lst));
        var without_current = makeup_amount(x, tail(lst));
        
        return append(with_current, without_current);
    } else if (x === 0) {
        return list([]);
    } else {
        return [];
    }
}

// Question 3
function accumulate_n(op, init, seqs) {
    if (is_empty_list(head(seqs))) {
        return [];
    } else {
        var current = accumulate(function (x, accum) {
                                     return pair(head(x), accum);
                                 }, [], seqs);
        
        var remain = accumulate(function (x, accum) {
                                    return pair(tail(x), accum);
                                }, [], seqs);
        
        return pair(accumulate(op, init, current),
                    accumulate_n(op, init, remain));
    }
}

// Question 4
function accumulate_tree(op, init, tree) {
    return accumulate(function (x, accum) {
        return is_list(x) ? op(accumulate(op, init, x), accum)
                          : op(x, accum);
    }, init, tree);
}

// Question 5
function permutations_r(s) {
    if (is_empty_list(s)) {
        return list([]);
    } else {
        return accumulate(append, [],
                          map(function (x) {
                              return map(function (p) {
                                  return pair(x, p);
                              },
                                         permutations_r(remove(x, s)));
                          }, s));
    }
}

function permutations_r(s, r) {
    if (r === 0) {
    // There is 1 permutation of length 0.
        return list([]);
    } else if (is_empty_list(s)) {
    // There is no permutation if s is empty but r is not 0.
        return [];
    } else {
        return accumulate(append, [],
                          map(function (x) {
                                  return map(function (p) {
                                                 return pair(x, p);
                                             },
                                             permutations_r(remove(x, s),
                                                            r - 1));
                              }, s));
    }
}

var interpreter = 10;
var mission_type = 'deathcube';
var timeout = '';
(function(window){

// stream.js: Supporting streams in the Scheme style, following
//            "stream discipline"
// A stream is either the empty list or a pair whose tail is
// a nullary function that returns a stream.

// Author: Martin Henz

// stream_tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function stream_tail(xs) {
    if (is_pair(xs)) {
        var tail = xs[1];
	if (typeof tail === "function") {
	    return tail();
	} else
            throw new Error("stream_tail(xs) expects a function as "
			    + "the tail of the argument pair xs, "
			    + "but encountered "+tail);
    } else {
        throw new Error("stream_tail(xs) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }

}

// is_stream recurses down the stream and checks that it ends with
// the empty list []; does not throw any exceptions
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
// Lazy? No: is_stream needs to go down the stream
function is_stream(xs) {
    return (array_test(xs) && xs.length === 0)
	|| (is_pair(xs) && typeof tail(xs) === "function" &&
            is_stream(stream_tail(xs)));
}

// list_to_stream transforms a given list to a stream
// Lazy? Yes: list_to_stream goes down the list only when forced
function list_to_stream(xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	return pair(head(xs),function() { return list_to_stream(tail(xs)); });
    }
}

// stream_to_list transforms a given stream to a list
// Lazy? No: stream_to_list needs to force the whole stream
function stream_to_list(xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	return pair(head(xs), stream_to_list(stream_tail(xs)));
    }
}

// stream makes a stream out of its arguments
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
// Lazy? No: In this implementation, we generate first a
//           complete list, and then a stream using list_to_stream
function stream() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = pair(arguments[i], the_list);
    }
    return list_to_stream(the_list);
}

// stream_length returns the length of a given argument stream
// throws an exception if the argument is not a stream
// Lazy? No: The function needs to explore the whole stream
function stream_length(xs) {
    if (is_empty_list(xs)) {
	return 0;
    } else {
	return 1 + stream_length(stream_tail(xs));
    }
}

// stream_map applies first arg f to the elements of the second
// argument, assumed to be a stream.
// f is applied element-by-element:
// stream_map(f,list_to_stream([1,[2,[]]])) results in
// the same as list_to_stream([f(1),[f(2),[]]])
// stream_map throws an exception if the second argument is not a
// stream, and if the second argument is a non-empty stream and the
// first argument is not a function.
// Lazy? Yes: The argument stream is only explored as forced by
//            the result stream.
function stream_map(f, s) {
    if (is_empty_list(s)) {
	return [];
    } else {
	return pair(f(head(s)),
                    function() {
			return stream_map(f, stream_tail(s));
                    });
    }
}

// build_stream takes a non-negative integer n as first argument,
// and a function fun as second argument.
// build_list returns a stream of n elements, that results from
// applying fun to the numbers from 0 to n-1.
// Lazy? Yes: The result stream forces the applications of fun
//            for the next element
function build_stream(n, fun){
    function build(i) {
	if (i >= n) {
	    return [];
	} else {
	    return pair(fun(i),function() { return build(i + 1); });
	}
    }
    return build(0);
}

// stream_for_each applies first arg fun to the elements of the list
// passed as second argument. fun is applied element-by-element:
// for_each(fun,list_to_stream([1,[2,[]]])) results in the calls fun(1)
// and fun(2).
// stream_for_each returns true.
// stream_for_each throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the
// first argument is not a function.
// Lazy? No: stream_for_each forces the exploration of the entire stream
function stream_for_each(fun,xs) {
    if (is_empty_list(xs)) {
	return true;
    } else {
        fun(head(xs));
	return stream_for_each(fun,stream_tail(xs));
    }
}

// stream_reverse reverses the argument stream
// stream_reverse throws an exception if the argument is not a stream.
// Lazy? No: stream_reverse forces the exploration of the entire stream
function stream_reverse(xs) {
    function rev(original, reversed) {
	if (is_empty_list(original)) {
	    return reversed;
	} else {
	    return rev(stream_tail(original),
		       pair(head(original), function() {return reversed;}));
	}
    }
    return rev(xs,[]);
}

// stream_to_vector returns vector that contains the elements of the argument
// stream in the given order.
// stream_to_vector throws an exception if the argument is not a stream
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
// Lazy? No: stream_to_vector forces the exploration of the entire stream
function stream_to_vector(lst){
    var vector = [];
    while(!is_empty_list(lst)){
        vector.push(head(lst));
        lst = stream_tail(lst);
    }
    return vector;
}

// stream_append appends first argument stream and second argument stream.
// In the result, the [] at the end of the first argument stream
// is replaced by the second argument stream
// stream_append throws an exception if the first argument is not a
// stream.
// Lazy? Yes: the result stream forces the actual append operation
function stream_append(xs, ys) {
    if (is_empty_list(xs)) {
	return ys;
    } else {
	return pair(head(xs),
		    function() { return stream_append(stream_tail(xs), ys); });
    }
}

// stream_member looks for a given first-argument element in a given
// second argument stream. It returns the first postfix substream
// that starts with the given element. It returns [] if the
// element does not occur in the stream
// Lazy? Sort-of: stream_member forces the stream only until the element is found.
function stream_member(x, s) {
    if (is_empty_list(s)) {
        return [];
    } else if (head(s) === x) {
        return s;
    } else {
        return stream_member(x, stream_tail(s));
    }
}

// stream_remove removes the first occurrence of a given first-argument element
// in a given second-argument list. Returns the original list
// if there is no occurrence.
// Lazy? Yes: the result stream forces the construction of each next element
function stream_remove(v, xs){
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return stream_tail(xs);
	} else {
	    return pair(head(xs),
			function() { return stream_remove(v, stream_tail(xs)); });
	}
    }
}

// stream_remove_all removes all instances of v instead of just the first.
// Lazy? Yes: the result stream forces the construction of each next element
function stream_remove_all(v, xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return stream_remove_all(v, stream_tail(xs));
	} else {
	    return pair(head(xs),
			function() { return stream_remove_all(v, stream_tail(xs)); });
	}
    }
}

// filter returns the substream of elements of given stream s
// for which the given predicate function p returns true.
// Lazy? Yes: The result stream forces the construction of
//            each next element. Of course, the construction
//            of the next element needs to go down the stream
//            until an element is found for which p holds.
function stream_filter(p, s) {
    if (is_empty_list(s)) {
	return [];
    } else if (p(head(s))) {
	return pair(head(s),
                    function() {
			return stream_filter(p,
					     stream_tail(s));
                    });
    } else {
	return stream_filter(p,
                             stream_tail(s));
    }
	      }

// enumerates numbers starting from start,
// using a step size of 1, until the number
// exceeds end.
// Lazy? Yes: The result stream forces the construction of
//            each next element
function enum_stream(start, end) {
    if (start > end) {
	return [];
    } else {
	return pair(start,
		    function() { return enum_stream(start + 1, end); });
    }
}

// integers_from constructs an infinite stream of integers
// starting at a given number n
// Lazy? Yes: The result stream forces the construction of
//            each next element
function integers_from(n) {
    return pair(n,
                function() {
                    return integers_from(n + 1);
                });
}

// eval_stream constructs the list of the first n elements
// of a given stream s
// Lazy? Sort-of: eval_stream only forces the computation of
//                the first n elements, and leaves the rest of
//                the stream untouched.
function eval_stream(s, n) {
    if (n === 0) {
        return [];
    } else {
        return pair(head(s),
                    eval_stream(stream_tail(s),
                                n - 1));
   }
}

// Returns the item in stream s at index n (the first item is at position 0)
// Lazy? Sort-of: stream_ref only forces the computation of
//                the first n elements, and leaves the rest of
//                the stream untouched.
function stream_ref(s, n) {
    if (n === 0) {
	return head(s);
    } else {
	return stream_ref(stream_tail(s), n - 1);
    }
}
// list.js: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)

// Author: Martin Henz

// array test works differently for Rhino and
// the Firefox environment (especially Web Console)
function array_test(x) {
    if (Array.isArray === undefined) {
        return x instanceof Array;
    } else {
        return Array.isArray(x);
    }
}

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function pair(x, xs) {
    return [x, xs];
}

// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_pair(x) {
    return array_test(x) && x.length === 2;
}

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function head(xs) {
    if (is_pair(xs)) {
        return xs[0];
    } else {
        throw new Error("head(xs) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function tail(xs) {
    if (is_pair(xs)) {
        return xs[1];
    } else {
        throw new Error("tail(xs) expects a pair as "
            + "argument xs, but encountered "+xs);
    }

}

// is_empty_list returns true if arg is []
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_empty_list(xs) {
    if (array_test(xs)) {
        if (xs.length === 0) {
            return true;
        } else if (xs.length === 2) {
            return false;
        } else {
            throw new Error("is_empty_list(xs) expects empty list " +
                "or pair as argument xs, but encountered "+xs);
        }
    } else {
        return false;
    }
}

// is_list recurses down the list and checks that it ends with the empty list []
// does not throw any exceptions
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function is_list(xs) {
    for ( ; ; xs = tail(xs)) {
		if (is_empty_list(xs)) {
			return true;
		} else if (!is_pair(xs)) {
            return false;
        }
    }
}

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function list() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = pair(arguments[i], the_list);
    }
    return the_list;
}

// list_to_vector returns vector that contains the elements of the argument list
// in the given order.
// list_to_vector throws an exception if the argument is not a list
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function list_to_vector(lst){
    var vector = [];
    while (!is_empty_list(lst)){
        vector.push(head(lst));
        lst = tail(lst);
    }
    return vector;
}

// vector_to_list returns a list that contains the elements of the argument vector
// in the given order.
// vector_to_list throws an exception if the argument is not a vector
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
function vector_to_list(vector) {
    if (vector.length === 0) {
        return [];
    }

    var result = [];
    for (var i = vector.length - 1; i >= 0; i = i - 1) {
        result = pair(vector[i], result);
    }
    return result;
}

// returns the length of a given argument list
// throws an exception if the argument is not a list
function length(xs) {
    for (var i = 0; !is_empty_list(xs); ++i) {
		xs = tail(xs);
    }
    return i;
}

// map applies first arg f to the elements of the second argument,
// assumed to be a list.
// f is applied element-by-element:
// map(f,[1,[2,[]]]) results in [f(1),[f(2),[]]]
// map throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the first
// argument is not a function.
function map(f, xs) {
    return (is_empty_list(xs))
        ? []
        : pair(f(head(xs)), map(f, tail(xs)));
}

// build_list takes a non-negative integer n as first argument,
// and a function fun as second argument.
// build_list returns a list of n elements, that results from
// applying fun to the numbers from 0 to n-1.
function build_list(n, fun) {
    function build(i, fun, already_built) {
        if (i < 0) {
            return already_built;
        } else {
            return build(i - 1, fun, pair(fun(i),
                        already_built));
        }
    }
    return build(n - 1, fun, []);
}

// for_each applies first arg fun to the elements of the list passed as
// second argument. fun is applied element-by-element:
// for_each(fun,[1,[2,[]]]) results in the calls fun(1) and fun(2).
// for_each returns true.
// for_each throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the
// first argument is not a function.
function for_each(fun, xs) {
    if (!is_list(xs)) {
        throw new Error("for_each expects a list as argument xs, but " +
            "encountered " + xs);
    }
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        fun(head(xs));
    }
    return true;
}

// list_to_string returns a string that represents the argument list.
// It applies itself recursively on the elements of the given list.
// When it encounters a non-list, it applies toString to it.
function list_to_string(l) {
    if (array_test(l) && l.length === 0) {
        return "[]";
    } else {
        if (!is_pair(l)){
            return l.toString();
        }else{
            return "["+list_to_string(head(l))+","+list_to_string(tail(l))+"]";
        }
    }
}

// reverse reverses the argument list
// reverse throws an exception if the argument is not a list.
function reverse(xs) {
    if (!is_list(xs)) {
        throw new Error("reverse(xs) expects a list as argument xs, but " +
            "encountered " + xs);
    }
    var result = [];
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        result = pair(head(xs), result);
    }
    return result;
}

// append first argument list and second argument list.
// In the result, the [] at the end of the first argument list
// is replaced by the second argument list
// append throws an exception if the first argument is not a list
function append(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else {
        return pair(head(xs), append(tail(xs), ys));
    }
}

// member looks for a given first-argument element in a given
// second argument list. It returns the first postfix sublist
// that starts with the given element. It returns [] if the
// element does not occur in the list
function member(v, xs){
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        if (head(xs) === v) {
            return xs;
        }
    }
    return [];
}

// removes the first occurrence of a given first-argument element
// in a given second-argument list. Returns the original list
// if there is no occurrence.
function remove(v, xs){
    if (is_empty_list(xs)) {
        return [];
    } else {
        if (v === head(xs)) {
            return tail(xs);
        } else {
            return pair(head(xs), remove(v, tail(xs)));
        }
    }
}

// Similar to remove. But removes all instances of v instead of just the first
function remove_all(v, xs) {
    if (is_empty_list(xs)) {
        return [];
    } else {
        if (v === head(xs)) {
            return remove_all(v, tail(xs));
        } else {
            return pair(head(xs), remove_all(v, tail(xs)))
        }
    }
}
// for backwards-compatibility
var removeAll = remove_all;

// equal computes the structural equality
// over its arguments
function equal(item1, item2){
    if (is_pair(item1) && is_pair(item2)) {
        return equal(head(item1), head(item2)) &&
            equal(tail(item1), tail(item2));
    } else if (array_test(item1) && item1.length === 0 &&
           array_test(item2) && item2.length === 0) {
        return true;
    } else {
        return item1 === item2;
    }
}

// assoc treats the second argument as an association,
// a list of (index,value) pairs.
// assoc returns the first (index,value) pair whose
// index equal (using structural equality) to the given
// first argument v. Returns false if there is no such
// pair
function assoc(v, xs){
    if (is_empty_list(xs)) {
        return false;
    } else if (equal(v, head(head(xs)))) {
        return head(xs);
    } else {
        return assoc(v, tail(xs));
    }
}

// filter returns the sublist of elements of given list xs
// for which the given predicate function returns true.
function filter(pred, xs){
    if (is_empty_list(xs)) {
        return xs;
    } else {
        if (pred(head(xs))) {
            return pair(head(xs), filter(pred, tail(xs)));
        } else {
            return filter(pred, tail(xs));
        }
    }
}

// enumerates numbers starting from start,
// using a step size of 1, until the number
// exceeds end.
function enum_list(start, end) {
    if (start > end) {
        return [];
    } else {
        return pair(start, enum_list(start + 1, end));
    }
}

// Returns the item in list lst at index n (the first item is at position 0)
function list_ref(xs, n) {
    if (n < 0) {
        throw new Error("list_ref(xs, n) expects a positive integer as " +
            "argument n, but encountered " + n);
    }

    for ( ; n > 0; --n) {
        xs = tail(xs);
    }
    return head(xs);
}

// accumulate applies given operation op to elements of a list
// in a right-to-left order, first apply op to the last element
// and an initial element, resulting in r1, then to the
// second-last element and r1, resulting in r2, etc, and finally
// to the first element and r_n-1, where n is the length of the
// list.
// accumulate(op,zero,list(1,2,3)) results in
// op(1, op(2, op(3, zero)))

function accumulate(op,initial,sequence) {
    if (is_empty_list(sequence)) {
        return initial;
    } else {
        return op(head(sequence),
                  accumulate(op,initial,tail(sequence)));
    }
}

// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

function set_head(xs,x) {
    if (is_pair(xs)) {
        xs[0] = x;
        return undefined;
    } else {
        throw new Error("set_head(xs,x) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

// set_tail(xs,x) changes the tail of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

function set_tail(xs,x) {
    if (is_pair(xs)) {
        xs[1] = x;
        return undefined;
    } else {
        throw new Error("set_tail(xs,x) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

//function display(str) {
//	var to_show = str;
//    if (is_array(str) && str.length > 2) {
//        to_show = '[' + str.toString() + ']';
//	} else if (is_array(str) && is_empty_list(str)) {
//		to_show = '[]';
//	} else if (is_pair(str)) {
//		to_show = '';
//		var stringize = function(item) {
//			if (is_empty_list(item)) {
//				return '[]';
//			} else if (is_pair(item)) {
//				return '[' + stringize(head(item)) + ', ' + stringize(tail(item)) + ']';
//			} else {
//				return item.toString();
//			}
//		}
//		to_show = stringize(str);
//	}
//	//process.stdout.write(to_show);
//	if (typeof to_show === 'function' && to_show.toString) {
//		console.log(to_show.toString());
//	} else {
//		console.log(to_show);
//	}
//	return str;
//}
globals = [];export_symbol('is_stream', is_stream);
export_symbol('stream_tail', stream_tail);
export_symbol('list_to_stream', list_to_stream);
export_symbol('stream_to_list', stream_to_list);
export_symbol('stream', stream);
export_symbol('stream_length', stream_length);
export_symbol('stream_map', stream_map);
export_symbol('build_stream', build_stream);
export_symbol('stream_for_each', stream_for_each);
export_symbol('stream_reverse', stream_reverse);
export_symbol('stream_append', stream_append);
export_symbol('stream_member', stream_member);
export_symbol('stream_remove', stream_remove);
export_symbol('stream_remove_all', stream_remove_all);
export_symbol('stream_filter', stream_filter);
export_symbol('enum_stream', enum_stream);
export_symbol('integers_from', integers_from);
export_symbol('eval_stream', eval_stream);
export_symbol('stream_ref', stream_ref);
export_symbol('array_test', array_test);
})(window);

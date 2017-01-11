// list.js: Supporting lists in the Scheme style, using pairs made
//          up of two-element JavaScript array (vector)

// Author: Martin Henz

// array test works differently for Rhino and
// the Firefox environment (especially Web Console)
exports.array_test = function (x) {
    if (Array.isArray === undefined) {
        return x instanceof Array;
    } else {
        return Array.isArray(x);
    }
};

// pair constructs a pair using a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.pair = function (x, xs) {
    return [x, xs];
};

// is_pair returns true iff arg is a two-element array
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.is_pair = function (x) {
    return exports.array_test(x) && x.length === 2;
};

// head returns the first component of the given pair,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.head = function (xs) {
    if (exports.is_pair(xs)) {
        return xs[0];
    } else {
        throw new Error("head(xs) expects a pair as " +
          "argument xs, but encountered "+xs);
    }
};

// tail returns the second component of the given pair
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.tail = function tail(xs) {
    if (exports.is_pair(xs)) {
        return xs[1];
    } else {
        throw new Error("tail(xs) expects a pair as " +
          "argument xs, but encountered "+xs);
    }
};

// is_empty_list returns true if arg is []
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.is_empty_list = function is_empty_list(xs) {
    if (exports.array_test(xs)) {
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
};

// is_list recurses down the list and checks that it ends with the empty list []
// does not throw any exceptions
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.is_list = function is_list(xs) {
    for ( ; ; xs = exports.tail(xs)) {
		if (exports.is_empty_list(xs)) {
			return true;
		} else if (!exports.is_pair(xs)) {
            return false;
        }
    }
};

// list makes a list out of its arguments
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.list = function list() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = exports.pair(arguments[i], the_list);
    }
    return the_list;
};

// list_to_vector returns vector that contains the elements of the argument list
// in the given order.
// list_to_vector throws an exception if the argument is not a list
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.list_to_vector = function list_to_vector(lst){
    var vector = [];
    while (!exports.is_empty_list(lst)){
        vector.push(head(lst));
        lst = exports.tail(lst);
    }
    return vector;
};

// vector_to_list returns a list that contains the elements of the argument vector
// in the given order.
// vector_to_list throws an exception if the argument is not a vector
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT
exports.vector_to_list = function vector_to_list(vector) {
    if (vector.length === 0) {
        return [];
    }

    var result = [];
    for (var i = vector.length - 1; i >= 0; i = i - 1) {
        result = exports.pair(vector[i], result);
    }
    return result;
};

// returns the length of a given argument list
// throws an exception if the argument is not a list
exports.length = function length(xs) {
    for (var i = 0; !exports.is_empty_list(xs); ++i) {
		xs = exports.tail(xs);
    }
    return i;
};

// map applies first arg f to the elements of the second argument,
// assumed to be a list.
// f is applied element-by-element:
// map(f,[1,[2,[]]]) results in [f(1),[f(2),[]]]
// map throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the first
// argument is not a function.
exports.map = function map(f, xs) {
    return (exports.is_empty_list(xs)) ?
        []
        : exports.pair(f(exports.head(xs)), exports.map(f, exports.tail(xs)));
};

// build_list takes a non-negative integer n as first argument,
// and a function fun as second argument.
// build_list returns a list of n elements, that results from
// applying fun to the numbers from 0 to n-1.
exports.build_list = function build_list(n, fun) {
    function build(i, fun, already_built) {
        if (i < 0) {
            return already_built;
        } else {
            return build(i - 1, fun, exports.pair(fun(i),
                        already_built));
        }
    }
    return build(n - 1, fun, []);
};

// for_each applies first arg fun to the elements of the list passed as
// second argument. fun is applied element-by-element:
// for_each(fun,[1,[2,[]]]) results in the calls fun(1) and fun(2).
// for_each returns true.
// for_each throws an exception if the second argument is not a list,
// and if the second argument is a non-empty list and the
// first argument is not a function.
exports.for_each = function for_each(fun, xs) {
    if (!exports.is_list(xs)) {
        throw new Error("for_each expects a list as argument xs, but " +
            "encountered " + xs);
    }
    for ( ; !exports.is_empty_list(xs); xs = exports.tail(xs)) {
        fun(exports.head(xs));
    }
    return true;
};

// list_to_string returns a string that represents the argument list.
// It applies itself recursively on the elements of the given list.
// When it encounters a non-list, it applies toString to it.
exports.list_to_string = function list_to_string(l) {
    if (exports.array_test(l) && l.length === 0) {
        return "[]";
    } else {
        if (!exports.is_pair(l)){
            return l.toString();
        }else{
            return "["+exports.list_to_string(exports.head(l))+","+exports.list_to_string(exports.tail(l))+"]";
        }
    }
};

// reverse reverses the argument list
// reverse throws an exception if the argument is not a list.
exports.reverse = function reverse(xs) {
    if (!exports.is_list(xs)) {
        throw new Error("reverse(xs) expects a list as argument xs, but " +
            "encountered " + xs);
    }
    var result = [];
    for ( ; !exports.is_empty_list(xs); xs = exports.tail(xs)) {
        result = exports.pair(exports.head(xs), result);
    }
    return result;
};

// append first argument list and second argument list.
// In the result, the [] at the end of the first argument list
// is replaced by the second argument list
// append throws an exception if the first argument is not a list
exports.append = function append(xs, ys) {
    if (exports.is_empty_list(xs)) {
        return ys;
    } else {
        return exports.pair(exports.head(xs), exports.append(exports.tail(xs), ys));
    }
};

// member looks for a given first-argument element in a given
// second argument list. It returns the first postfix sublist
// that starts with the given element. It returns [] if the
// element does not occur in the list
exports.member = function member(v, xs){
    for ( ; !exports.is_empty_list(xs); xs = exports.tail(xs)) {
        if (exports.head(xs) === v) {
            return xs;
        }
    }
    return [];
};

// removes the first occurrence of a given first-argument element
// in a given second-argument list. Returns the original list
// if there is no occurrence.
exports.remove = function remove(v, xs){
    if (exports.is_empty_list(xs)) {
        return [];
    } else {
        if (v === exports.head(xs)) {
            return exports.tail(xs);
        } else {
            return exports.pair(exports.head(xs), exports.remove(v, exports.tail(xs)));
        }
    }
};

// Similar to remove. But removes all instances of v instead of just the first
exports.remove_all = function remove_all(v, xs) {
    if (exports.is_empty_list(xs)) {
        return [];
    } else {
        if (v === exports.head(xs)) {
            return exports.remove_all(v, exports.tail(xs));
        } else {
            return exports.pair(exports.head(xs), exports.remove_all(v, exports.tail(xs)));
        }
    }
};
// for backwards-compatibility
exports.removeAll = exports.remove_all;

// equal computes the structural equality
// over its arguments
exports.equal = function equal(item1, item2){
    if (exports.is_pair(item1) && exports.is_pair(item2)) {
        return exports.equal(exports.head(item1), exports.head(item2)) &&
            exports.equal(exports.tail(item1), exports.tail(item2));
    } else if (exports.array_test(item1) && item1.length === 0 &&
           exports.array_test(item2) && item2.length === 0) {
        return true;
    } else {
        return item1 === item2;
    }
};

// assoc treats the second argument as an association,
// a list of (index,value) pairs.
// assoc returns the first (index,value) pair whose
// index equal (using structural equality) to the given
// first argument v. Returns false if there is no such
// pair
exports.assoc = function assoc(v, xs){
    if (exports.is_empty_list(xs)) {
        return false;
    } else if (exports.equal(v, exports.head(exports.head(xs)))) {
        return exports.head(xs);
    } else {
        return exports.assoc(v, exports.tail(xs));
    }
};

// filter returns the sublist of elements of given list xs
// for which the given predicate function returns true.
exports.filter = function filter(pred, xs){
    if (exports.is_empty_list(xs)) {
        return xs;
    } else {
        if (pred(exports.head(xs))) {
            return exports.pair(exports.head(xs), exports.filter(pred, exports.tail(xs)));
        } else {
            return exports.filter(pred, exports.tail(xs));
        }
    }
};

// enumerates numbers starting from start,
// using a step size of 1, until the number
// exceeds end.
exports.enum_list = function enum_list(start, end) {
    if (start > end) {
        return [];
    } else {
        return exports.pair(start, exports.enum_list(start + 1, end));
    }
};

// Returns the item in list lst at index n (the first item is at position 0)
exports.list_ref = function list_ref(xs, n) {
    if (n < 0) {
        throw new Error("list_ref(xs, n) expects a positive integer as " +
            "argument n, but encountered " + n);
    }

    for ( ; n > 0; --n) {
        xs = exports.tail(xs);
    }
    return exports.head(xs);
};

// accumulate applies given operation op to elements of a list
// in a right-to-left order, first apply op to the last element
// and an initial element, resulting in r1, then to the
// second-last element and r1, resulting in r2, etc, and finally
// to the first element and r_n-1, where n is the length of the
// list.
// accumulate(op,zero,list(1,2,3)) results in
// op(1, op(2, op(3, zero)))

exports.accumulate = function accumulate(op,initial,sequence) {
    if (exports.is_empty_list(sequence)) {
        return initial;
    } else {
        return op(exports.head(sequence),
                  exports.accumulate(op,initial,exports.tail(sequence)));
    }
};

// set_head(xs,x) changes the head of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

exports.set_head = function set_head(xs,x) {
    if (exports.is_pair(xs)) {
        xs[0] = x;
        return undefined;
    } else {
        throw new Error("set_head(xs,x) expects a pair as " +
          "argument xs, but encountered "+xs);
    }
};

// set_tail(xs,x) changes the tail of given pair xs to be x,
// throws an exception if the argument is not a pair
// LOW-LEVEL FUNCTION, NOT JEDISCRIPT

exports.set_tail = function set_tail(xs,x) {
    if (exports.is_pair(xs)) {
        xs[1] = x;
        return undefined;
    } else {
        throw new Error("set_tail(xs,x) expects a pair as " +
          "argument xs, but encountered "+xs);
    }
};

exports.display = function display(str) {
	var to_show = str;
    if (exports.is_array(str) && str.length > 2) {
        to_show = '[' + str.toString() + ']';
	} else if (exports.is_array(str) && exports.is_empty_list(str)) {
		to_show = '[]';
	} else if (exports.is_pair(str)) {
		to_show = '';
		var stringize = function(item) {
			if (exports.is_empty_list(item)) {
				return '[]';
			} else if (exports.is_pair(item)) {
				return '[' + exports.stringize(head(item)) + ', ' + exports.stringize(tail(item)) + ']';
			} else {
				return item.toString();
			}
		};
		to_show = exports.stringize(str);
	}
	//process.stdout.write(to_show);
	if (typeof to_show === 'function' && to_show.toString) {
		console.log(to_show.toString());
	} else {
		console.log(to_show);
	}
	return str;
};

exports.alert = function(x) {
  console.log(x);
};

exports.display = exports.alert;

exports.prompt = function() {
  console.log("Prompt is unsupported");
};


exports.is_null = function is_null(xs) {
	return xs === null;
};

exports.is_undefined = function is_undefined(xs) {
	return typeof xs === "undefined";
};

exports.is_number = function is_number(xs) {
	return typeof xs === "number";
};

exports.is_string = function is_string(xs) {
	return typeof xs === "string";
};

exports.is_boolean = function is_boolean(xs) {
	return typeof xs === "boolean";
};

exports.is_object = function is_object(xs) {
	return typeof xs === "object" || is_function(xs);
};

exports.is_function = function is_function(xs) {
	return typeof xs === "function";
};

exports.is_NaN = function is_NaN(x) {
	return is_number(x) && isNaN(x);
};

exports.has_own_property = function has_own_property(obj,p) {
	return obj.hasOwnProperty(p);
};

exports.is_array = function is_array(a){
	return a instanceof Array;
};

/**
 * @deprecated Use timed instead.
 * @returns The current time, in milliseconds, from the Unix Epoch.
 */
exports.runtime = function runtime() {
	var d = new Date();
	return d.getTime();
};

/**
 * Throws an error from the interpreter, stopping execution.
 *
 * @param {string} message The error message.
 * @param {number=} line The line number where the error occurred. This line number
 *                       will be one less than on file, because the indices used by
 *                       jison start from 0.
 * @returns {null} Should not return. Exception should be thrown otherwise program
 *                 will be in an invalid state.
 */
exports.error = function error(message, line) {
	throw new SyntaxError(message, null,
		line === undefined ? undefined : line + 1);
};

exports.newline = function newline() {
	display("\n");
};

exports.random = function random(k){
	return Math.floor(Math.random()*k);
};

exports.apply_in_underlying_javascript = function apply_in_underlying_javascript(prim,argument_list) {
   var argument_array = list_to_vector(argument_list);

   //Call prim with the same this argument as what we are running under.
   //this is populated with an object reference when we are an object. We
   //are not in this context, so this will usually be the window. Thus
   //passing this as the argument shouls behave. (Notably, passing the
   //function itself as a value of this is bad: if the function that is being
   //called assumes this to be window, we'll clobber the function value instead.
   //Also, alert won't work if we pass prim as the first argument.)
   return prim.apply(this, argument_array);
};

exports.alert = function(x) {
  console.log(x);
};

exports.display = exports.alert;

exports.prompt = function() {
  console.log("Prompt is unsupported");
};


exports.is_null = function is_null(xs) {
	return xs === null;
};

exports.is_undefined = function is_undefined(xs) {
	return typeof xs === "undefined";
};

exports.is_number = function is_number(xs) {
	return typeof xs === "number";
};

exports.is_string = function is_string(xs) {
	return typeof xs === "string";
};

exports.is_boolean = function is_boolean(xs) {
	return typeof xs === "boolean";
};

exports.is_object = function is_object(xs) {
	return typeof xs === "object" || is_function(xs);
};

exports.is_function = function is_function(xs) {
	return typeof xs === "function";
};

exports.is_NaN = function is_NaN(x) {
	return is_number(x) && isNaN(x);
};

exports.has_own_property = function has_own_property(obj,p) {
	return obj.hasOwnProperty(p);
};

exports.is_array = function is_array(a){
	return a instanceof Array;
};

/**
 * @deprecated Use timed instead.
 * @returns The current time, in milliseconds, from the Unix Epoch.
 */
exports.runtime = function runtime() {
	var d = new Date();
	return d.getTime();
};

/**
 * Throws an error from the interpreter, stopping execution.
 *
 * @param {string} message The error message.
 * @param {number=} line The line number where the error occurred. This line number
 *                       will be one less than on file, because the indices used by
 *                       jison start from 0.
 * @returns {null} Should not return. Exception should be thrown otherwise program
 *                 will be in an invalid state.
 */
exports.error = function error(message, line) {
	throw new SyntaxError(message, null,
		line === undefined ? undefined : line + 1);
};

exports.newline = function newline() {
	display("\n");
};

exports.random = function random(k){
	return Math.floor(Math.random()*k);
};

exports.apply_in_underlying_javascript = function apply_in_underlying_javascript(prim,argument_list) {
   var argument_array = list_to_vector(argument_list);

   //Call prim with the same this argument as what we are running under.
   //this is populated with an object reference when we are an object. We
   //are not in this context, so this will usually be the window. Thus
   //passing this as the argument shouls behave. (Notably, passing the
   //function itself as a value of this is bad: if the function that is being
   //called assumes this to be window, we'll clobber the function value instead.
   //Also, alert won't work if we pass prim as the first argument.)
   return prim.apply(this, argument_array);
};

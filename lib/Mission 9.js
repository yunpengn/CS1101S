var interpreter = 5;
var mission_type = 'rsa';
(function(window){
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

function display(str) {
	var to_show = str;
    if (is_array(str) && str.length > 2) {
        to_show = '[' + str.toString() + ']';
	} else if (is_array(str) && is_empty_list(str)) {
		to_show = '[]';
	} else if (is_pair(str)) {
		to_show = '';
		var stringize = function(item) {
			if (is_empty_list(item)) {
				return '[]';
			} else if (is_pair(item)) {
				return '[' + stringize(head(item)) + ', ' + stringize(tail(item)) + ']';
			} else {
				return item.toString();
			}
		}
		to_show = stringize(str);
	}
	//process.stdout.write(to_show);
	if (typeof to_show === 'function' && to_show.toString) {
		console.log(to_show.toString());
	} else {
		console.log(to_show);
	}
	return str;
}
(function(exports){
/*
	JavaScript BigInteger library version 0.9
	http://silentmatt.com/biginteger/

	Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
	Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
	Licensed under the MIT license.

	Support for arbitrary internal representation base was added by
	Vitaly Magerya.
*/

/*
	File: biginteger.js

	Exports:

		<BigInteger>
*/
var x = {};
(function(exports) {
	"use strict";
	/*
		Class: BigInteger
		An arbitrarily-large integer.

		<BigInteger> objects should be considered immutable. None of the "built-in"
		methods modify *this* or their arguments. All properties should be
		considered private.

		All the methods of <BigInteger> instances can be called "statically". The
		static versions are convenient if you don't already have a <BigInteger>
		object.

		As an example, these calls are equivalent.

		> BigInteger(4).multiply(5); // returns BigInteger(20);
		> BigInteger.multiply(4, 5); // returns BigInteger(20);

		> var a = 42;
		> var a = BigInteger.toJSValue("0b101010"); // Not completely useless...
	*/

	// IE doesn't support Array.prototype.map
	if (!Array.prototype.map) {
		Array.prototype.map = function(fun /*, thisp*/) {
			var len = this.length >>> 0;
			if (typeof fun !== "function") {
				throw new TypeError();
			}

			var res = new Array(len);
			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in this) {
					res[i] = fun.call(thisp, this[i], i, this);
				}
			}

			return res;
		};
	}

	var CONSTRUCT = {}; // Unique token to call "private" version of constructor

	/*
		Constructor: BigInteger()
		Convert a value to a <BigInteger>.

		Although <BigInteger()> is the constructor for <BigInteger> objects, it is
		best not to call it as a constructor. If *n* is a <BigInteger> object, it is
		simply returned as-is. Otherwise, <BigInteger()> is equivalent to <parse>
		without a radix argument.

		> var n0 = BigInteger();      // Same as <BigInteger.ZERO>
		> var n1 = BigInteger("123"); // Create a new <BigInteger> with value 123
		> var n2 = BigInteger(123);   // Create a new <BigInteger> with value 123
		> var n3 = BigInteger(n2);    // Return n2, unchanged

		The constructor form only takes an array and a sign. *n* must be an
		array of numbers in little-endian order, where each digit is between 0
		and BigInteger.base.  The second parameter sets the sign: -1 for
		negative, +1 for positive, or 0 for zero. The array is *not copied and
		may be modified*. If the array contains only zeros, the sign parameter
		is ignored and is forced to zero.

		> new BigInteger([5], -1): create a new BigInteger with value -5

		Parameters:

			n - Value to convert to a <BigInteger>.

		Returns:

			A <BigInteger> value.

		See Also:

			<parse>, <BigInteger>
	*/
	function BigInteger(n, s, token) {
		if (token !== CONSTRUCT) {
			if (n instanceof BigInteger) {
				return n;
			}
			else if (typeof n === "undefined") {
				return ZERO;
			}
			return BigInteger.parse(n);
		}

		n = n || [];  // Provide the nullary constructor for subclasses.
		while (n.length && !n[n.length - 1]) {
			--n.length;
		}
		this._d = n;
		this._s = n.length ? (s || 1) : 0;
	}

	BigInteger._construct = function(n, s) {
		return new BigInteger(n, s, CONSTRUCT);
	};

	// Base-10 speedup hacks in parse, toString, exp10 and log functions
	// require base to be a power of 10. 10^7 is the largest such power
	// that won't cause a precision loss when digits are multiplied.
	var BigInteger_base = 10000000;
	var BigInteger_base_log10 = 7;

	BigInteger.base = BigInteger_base;
	BigInteger.base_log10 = BigInteger_base_log10;

	var ZERO = new BigInteger([], 0, CONSTRUCT);
	// Constant: ZERO
	// <BigInteger> 0.
	BigInteger.ZERO = ZERO;

	var ONE = new BigInteger([1], 1, CONSTRUCT);
	// Constant: ONE
	// <BigInteger> 1.
	BigInteger.ONE = ONE;

	var M_ONE = new BigInteger(ONE._d, -1, CONSTRUCT);
	// Constant: M_ONE
	// <BigInteger> -1.
	BigInteger.M_ONE = M_ONE;

	// Constant: _0
	// Shortcut for <ZERO>.
	BigInteger._0 = ZERO;

	// Constant: _1
	// Shortcut for <ONE>.
	BigInteger._1 = ONE;

	/*
		Constant: small
		Array of <BigIntegers> from 0 to 36.

		These are used internally for parsing, but useful when you need a "small"
		<BigInteger>.

		See Also:

			<ZERO>, <ONE>, <_0>, <_1>
	*/
	BigInteger.small = [
		ZERO,
		ONE,
		/* Assuming BigInteger_base > 36 */
		new BigInteger( [2], 1, CONSTRUCT),
		new BigInteger( [3], 1, CONSTRUCT),
		new BigInteger( [4], 1, CONSTRUCT),
		new BigInteger( [5], 1, CONSTRUCT),
		new BigInteger( [6], 1, CONSTRUCT),
		new BigInteger( [7], 1, CONSTRUCT),
		new BigInteger( [8], 1, CONSTRUCT),
		new BigInteger( [9], 1, CONSTRUCT),
		new BigInteger([10], 1, CONSTRUCT),
		new BigInteger([11], 1, CONSTRUCT),
		new BigInteger([12], 1, CONSTRUCT),
		new BigInteger([13], 1, CONSTRUCT),
		new BigInteger([14], 1, CONSTRUCT),
		new BigInteger([15], 1, CONSTRUCT),
		new BigInteger([16], 1, CONSTRUCT),
		new BigInteger([17], 1, CONSTRUCT),
		new BigInteger([18], 1, CONSTRUCT),
		new BigInteger([19], 1, CONSTRUCT),
		new BigInteger([20], 1, CONSTRUCT),
		new BigInteger([21], 1, CONSTRUCT),
		new BigInteger([22], 1, CONSTRUCT),
		new BigInteger([23], 1, CONSTRUCT),
		new BigInteger([24], 1, CONSTRUCT),
		new BigInteger([25], 1, CONSTRUCT),
		new BigInteger([26], 1, CONSTRUCT),
		new BigInteger([27], 1, CONSTRUCT),
		new BigInteger([28], 1, CONSTRUCT),
		new BigInteger([29], 1, CONSTRUCT),
		new BigInteger([30], 1, CONSTRUCT),
		new BigInteger([31], 1, CONSTRUCT),
		new BigInteger([32], 1, CONSTRUCT),
		new BigInteger([33], 1, CONSTRUCT),
		new BigInteger([34], 1, CONSTRUCT),
		new BigInteger([35], 1, CONSTRUCT),
		new BigInteger([36], 1, CONSTRUCT)
	];

	// Used for parsing/radix conversion
	BigInteger.digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	/*
		Method: toString
		Convert a <BigInteger> to a string.

		When *base* is greater than 10, letters are upper case.

		Parameters:

			base - Optional base to represent the number in (default is base 10).
			       Must be between 2 and 36 inclusive, or an Error will be thrown.

		Returns:

			The string representation of the <BigInteger>.
	*/
	BigInteger.prototype.toString = function(base) {
		base = +base || 10;
		if (base < 2 || base > 36) {
			throw new Error("illegal radix " + base + ".");
		}
		if (this._s === 0) {
			return "0";
		}
		if (base === 10) {
			var str = this._s < 0 ? "-" : "";
			str += this._d[this._d.length - 1].toString();
			for (var i = this._d.length - 2; i >= 0; i--) {
				var group = this._d[i].toString();
				while (group.length < BigInteger_base_log10) group = '0' + group;
				str += group;
			}
			return str;
		}
		else {
			var numerals = BigInteger.digits;
			base = BigInteger.small[base];
			var sign = this._s;

			var n = this.abs();
			var digits = [];
			var digit;

			while (n._s !== 0) {
				var divmod = n.divRem(base);
				n = divmod[0];
				digit = divmod[1];
				// TODO: This could be changed to unshift instead of reversing at the end.
				// Benchmark both to compare speeds.
				digits.push(numerals[digit.valueOf()]);
			}
			return (sign < 0 ? "-" : "") + digits.reverse().join("");
		}
	};

	// Verify strings for parsing
	BigInteger.radixRegex = [
		/^$/,
		/^$/,
		/^[01]*$/,
		/^[012]*$/,
		/^[0-3]*$/,
		/^[0-4]*$/,
		/^[0-5]*$/,
		/^[0-6]*$/,
		/^[0-7]*$/,
		/^[0-8]*$/,
		/^[0-9]*$/,
		/^[0-9aA]*$/,
		/^[0-9abAB]*$/,
		/^[0-9abcABC]*$/,
		/^[0-9a-dA-D]*$/,
		/^[0-9a-eA-E]*$/,
		/^[0-9a-fA-F]*$/,
		/^[0-9a-gA-G]*$/,
		/^[0-9a-hA-H]*$/,
		/^[0-9a-iA-I]*$/,
		/^[0-9a-jA-J]*$/,
		/^[0-9a-kA-K]*$/,
		/^[0-9a-lA-L]*$/,
		/^[0-9a-mA-M]*$/,
		/^[0-9a-nA-N]*$/,
		/^[0-9a-oA-O]*$/,
		/^[0-9a-pA-P]*$/,
		/^[0-9a-qA-Q]*$/,
		/^[0-9a-rA-R]*$/,
		/^[0-9a-sA-S]*$/,
		/^[0-9a-tA-T]*$/,
		/^[0-9a-uA-U]*$/,
		/^[0-9a-vA-V]*$/,
		/^[0-9a-wA-W]*$/,
		/^[0-9a-xA-X]*$/,
		/^[0-9a-yA-Y]*$/,
		/^[0-9a-zA-Z]*$/
	];

	/*
		Function: parse
		Parse a string into a <BigInteger>.

		*base* is optional but, if provided, must be from 2 to 36 inclusive. If
		*base* is not provided, it will be guessed based on the leading characters
		of *s* as follows:

		- "0x" or "0X": *base* = 16
		- "0c" or "0C": *base* = 8
		- "0b" or "0B": *base* = 2
		- else: *base* = 10

		If no base is provided, or *base* is 10, the number can be in exponential
		form. For example, these are all valid:

		> BigInteger.parse("1e9");              // Same as "1000000000"
		> BigInteger.parse("1.234*10^3");       // Same as 1234
		> BigInteger.parse("56789 * 10 ** -2"); // Same as 567

		If any characters fall outside the range defined by the radix, an exception
		will be thrown.

		Parameters:

			s - The string to parse.
			base - Optional radix (default is to guess based on *s*).

		Returns:

			a <BigInteger> instance.
	*/
	BigInteger.parse = function(s, base) {
		// Expands a number in exponential form to decimal form.
		// expandExponential("-13.441*10^5") === "1344100";
		// expandExponential("1.12300e-1") === "0.112300";
		// expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
		function expandExponential(str) {
			str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, "e");

			return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
				c = +c;
				var l = c < 0;
				var i = n.length + c;
				x = (l ? n : f).length;
				c = ((c = Math.abs(c)) >= x ? c - x + l : 0);
				var z = (new Array(c + 1)).join("0");
				var r = n + f;
				return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
			});
		}

		s = s.toString();
		if (typeof base === "undefined" || +base === 10) {
			s = expandExponential(s);
		}

		var prefixRE;
		if (typeof base === "undefined") {
			prefixRE = '0[xcb]';
		}
		else if (base == 16) {
			prefixRE = '0x';
		}
		else if (base == 8) {
			prefixRE = '0c';
		}
		else if (base == 2) {
			prefixRE = '0b';
		}
		else {
			prefixRE = '';
		}
		var parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s);
		if (parts) {
			var sign = parts[1] || "+";
			var baseSection = parts[2] || "";
			var digits = parts[3] || "";

			if (typeof base === "undefined") {
				// Guess base
				if (baseSection === "0x" || baseSection === "0X") { // Hex
					base = 16;
				}
				else if (baseSection === "0c" || baseSection === "0C") { // Octal
					base = 8;
				}
				else if (baseSection === "0b" || baseSection === "0B") { // Binary
					base = 2;
				}
				else {
					base = 10;
				}
			}
			else if (base < 2 || base > 36) {
				throw new Error("Illegal radix " + base + ".");
			}

			base = +base;

			// Check for digits outside the range
			if (!(BigInteger.radixRegex[base].test(digits))) {
				throw new Error("Bad digit for radix " + base);
			}

			// Strip leading zeros, and convert to array
			digits = digits.replace(/^0+/, "").split("");
			if (digits.length === 0) {
				return ZERO;
			}

			// Get the sign (we know it's not zero)
			sign = (sign === "-") ? -1 : 1;

			// Optimize 10
			if (base == 10) {
				var d = [];
				while (digits.length >= BigInteger_base_log10) {
					d.push(parseInt(digits.splice(digits.length-BigInteger.base_log10, BigInteger.base_log10).join(''), 10));
				}
				d.push(parseInt(digits.join(''), 10));
				return new BigInteger(d, sign, CONSTRUCT);
			}

			// Optimize base
			if (base === BigInteger_base) {
				return new BigInteger(digits.map(Number).reverse(), sign, CONSTRUCT);
			}

			// Do the conversion
			var d = ZERO;
			base = BigInteger.small[base];
			var small = BigInteger.small;
			for (var i = 0; i < digits.length; i++) {
				d = d.multiply(base).add(small[parseInt(digits[i], 36)]);
			}
			return new BigInteger(d._d, sign, CONSTRUCT);
		}
		else {
			throw new Error("Invalid BigInteger format: " + s);
		}
	};

	/*
		Function: add
		Add two <BigIntegers>.

		Parameters:

			n - The number to add to *this*. Will be converted to a <BigInteger>.

		Returns:

			The numbers added together.

		See Also:

			<subtract>, <multiply>, <quotient>, <next>
	*/
	BigInteger.prototype.add = function(n) {
		if (this._s === 0) {
			return BigInteger(n);
		}

		n = BigInteger(n);
		if (n._s === 0) {
			return this;
		}
		if (this._s !== n._s) {
			n = n.negate();
			return this.subtract(n);
		}

		var a = this._d;
		var b = n._d;
		var al = a.length;
		var bl = b.length;
		var sum = new Array(Math.max(al, bl) + 1);
		var size = Math.min(al, bl);
		var carry = 0;
		var digit;

		for (var i = 0; i < size; i++) {
			digit = a[i] + b[i] + carry;
			sum[i] = digit % BigInteger_base;
			carry = (digit / BigInteger_base) | 0;
		}
		if (bl > al) {
			a = b;
			al = bl;
		}
		for (i = size; carry && i < al; i++) {
			digit = a[i] + carry;
			sum[i] = digit % BigInteger_base;
			carry = (digit / BigInteger_base) | 0;
		}
		if (carry) {
			sum[i] = carry;
		}

		for ( ; i < al; i++) {
			sum[i] = a[i];
		}

		return new BigInteger(sum, this._s, CONSTRUCT);
	};

	/*
		Function: negate
		Get the additive inverse of a <BigInteger>.

		Returns:

			A <BigInteger> with the same magnatude, but with the opposite sign.

		See Also:

			<abs>
	*/
	BigInteger.prototype.negate = function() {
		return new BigInteger(this._d, (-this._s) | 0, CONSTRUCT);
	};

	/*
		Function: abs
		Get the absolute value of a <BigInteger>.

		Returns:

			A <BigInteger> with the same magnatude, but always positive (or zero).

		See Also:

			<negate>
	*/
	BigInteger.prototype.abs = function() {
		return (this._s < 0) ? this.negate() : this;
	};

	/*
		Function: subtract
		Subtract two <BigIntegers>.

		Parameters:

			n - The number to subtract from *this*. Will be converted to a <BigInteger>.

		Returns:

			The *n* subtracted from *this*.

		See Also:

			<add>, <multiply>, <quotient>, <prev>
	*/
	BigInteger.prototype.subtract = function(n) {
		if (this._s === 0) {
			return BigInteger(n).negate();
		}

		n = BigInteger(n);
		if (n._s === 0) {
			return this;
		}
		if (this._s !== n._s) {
			n = n.negate();
			return this.add(n);
		}

		var m = this;
		// negative - negative => -|a| - -|b| => -|a| + |b| => |b| - |a|
		if (this._s < 0) {
			m = new BigInteger(n._d, 1, CONSTRUCT);
			n = new BigInteger(this._d, 1, CONSTRUCT);
		}

		// Both are positive => a - b
		var sign = m.compareAbs(n);
		if (sign === 0) {
			return ZERO;
		}
		else if (sign < 0) {
			// swap m and n
			var t = n;
			n = m;
			m = t;
		}

		// a > b
		var a = m._d;
		var b = n._d;
		var al = a.length;
		var bl = b.length;
		var diff = new Array(al); // al >= bl since a > b
		var borrow = 0;
		var i;
		var digit;

		for (i = 0; i < bl; i++) {
			digit = a[i] - borrow - b[i];
			if (digit < 0) {
				digit += BigInteger_base;
				borrow = 1;
			}
			else {
				borrow = 0;
			}
			diff[i] = digit;
		}
		for (i = bl; i < al; i++) {
			digit = a[i] - borrow;
			if (digit < 0) {
				digit += BigInteger_base;
			}
			else {
				diff[i++] = digit;
				break;
			}
			diff[i] = digit;
		}
		for ( ; i < al; i++) {
			diff[i] = a[i];
		}

		return new BigInteger(diff, sign, CONSTRUCT);
	};

	(function() {
		function addOne(n, sign) {
			var a = n._d;
			var sum = a.slice();
			var carry = true;
			var i = 0;

			while (true) {
				var digit = (a[i] || 0) + 1;
				sum[i] = digit % BigInteger_base;
				if (digit <= BigInteger_base - 1) {
					break;
				}
				++i;
			}

			return new BigInteger(sum, sign, CONSTRUCT);
		}

		function subtractOne(n, sign) {
			var a = n._d;
			var sum = a.slice();
			var borrow = true;
			var i = 0;

			while (true) {
				var digit = (a[i] || 0) - 1;
				if (digit < 0) {
					sum[i] = digit + BigInteger_base;
				}
				else {
					sum[i] = digit;
					break;
				}
				++i;
			}

			return new BigInteger(sum, sign, CONSTRUCT);
		}

		/*
			Function: next
			Get the next <BigInteger> (add one).

			Returns:

				*this* + 1.

			See Also:

				<add>, <prev>
		*/
		BigInteger.prototype.next = function() {
			switch (this._s) {
			case 0:
				return ONE;
			case -1:
				return subtractOne(this, -1);
			// case 1:
			default:
				return addOne(this, 1);
			}
		};

		/*
			Function: prev
			Get the previous <BigInteger> (subtract one).

			Returns:

				*this* - 1.

			See Also:

				<next>, <subtract>
		*/
		BigInteger.prototype.prev = function() {
			switch (this._s) {
			case 0:
				return M_ONE;
			case -1:
				return addOne(this, -1);
			// case 1:
			default:
				return subtractOne(this, 1);
			}
		};
	})();

	/*
		Function: compareAbs
		Compare the absolute value of two <BigIntegers>.

		Calling <compareAbs> is faster than calling <abs> twice, then <compare>.

		Parameters:

			n - The number to compare to *this*. Will be converted to a <BigInteger>.

		Returns:

			-1, 0, or +1 if *|this|* is less than, equal to, or greater than *|n|*.

		See Also:

			<compare>, <abs>
	*/
	BigInteger.prototype.compareAbs = function(n) {
		if (this === n) {
			return 0;
		}

		if (!(n instanceof BigInteger)) {
			if (!isFinite(n)) {
				return(isNaN(n) ? n : -1);
			}
			n = BigInteger(n);
		}

		if (this._s === 0) {
			return (n._s !== 0) ? -1 : 0;
		}
		if (n._s === 0) {
			return 1;
		}

		var l = this._d.length;
		var nl = n._d.length;
		if (l < nl) {
			return -1;
		}
		else if (l > nl) {
			return 1;
		}

		var a = this._d;
		var b = n._d;
		for (var i = l-1; i >= 0; i--) {
			if (a[i] !== b[i]) {
				return a[i] < b[i] ? -1 : 1;
			}
		}

		return 0;
	};

	/*
		Function: compare
		Compare two <BigIntegers>.

		Parameters:

			n - The number to compare to *this*. Will be converted to a <BigInteger>.

		Returns:

			-1, 0, or +1 if *this* is less than, equal to, or greater than *n*.

		See Also:

			<compareAbs>, <isPositive>, <isNegative>, <isUnit>
	*/
	BigInteger.prototype.compare = function(n) {
		if (this === n) {
			return 0;
		}

		n = BigInteger(n);

		if (this._s === 0) {
			return -n._s;
		}

		if (this._s === n._s) { // both positive or both negative
			var cmp = this.compareAbs(n);
			return cmp * this._s;
		}
		else {
			return this._s;
		}
	};

	/*
		Function: isUnit
		Return true iff *this* is either 1 or -1.

		Returns:

			true if *this* compares equal to <BigInteger.ONE> or <BigInteger.M_ONE>.

		See Also:

			<isZero>, <isNegative>, <isPositive>, <compareAbs>, <compare>,
			<BigInteger.ONE>, <BigInteger.M_ONE>
	*/
	BigInteger.prototype.isUnit = function() {
		return this === ONE ||
			this === M_ONE ||
			(this._d.length === 1 && this._d[0] === 1);
	};

	/*
		Function: multiply
		Multiply two <BigIntegers>.

		Parameters:

			n - The number to multiply *this* by. Will be converted to a
			<BigInteger>.

		Returns:

			The numbers multiplied together.

		See Also:

			<add>, <subtract>, <quotient>, <square>
	*/
	BigInteger.prototype.multiply = function(n) {
		// TODO: Consider adding Karatsuba multiplication for large numbers
		if (this._s === 0) {
			return ZERO;
		}

		n = BigInteger(n);
		if (n._s === 0) {
			return ZERO;
		}
		if (this.isUnit()) {
			if (this._s < 0) {
				return n.negate();
			}
			return n;
		}
		if (n.isUnit()) {
			if (n._s < 0) {
				return this.negate();
			}
			return this;
		}
		if (this === n) {
			return this.square();
		}

		var r = (this._d.length >= n._d.length);
		var a = (r ? this : n)._d; // a will be longer than b
		var b = (r ? n : this)._d;
		var al = a.length;
		var bl = b.length;

		var pl = al + bl;
		var partial = new Array(pl);
		var i;
		for (i = 0; i < pl; i++) {
			partial[i] = 0;
		}

		for (i = 0; i < bl; i++) {
			var carry = 0;
			var bi = b[i];
			var jlimit = al + i;
			var digit;
			for (var j = i; j < jlimit; j++) {
				digit = partial[j] + bi * a[j - i] + carry;
				carry = (digit / BigInteger_base) | 0;
				partial[j] = (digit % BigInteger_base) | 0;
			}
			if (carry) {
				digit = partial[j] + carry;
				carry = (digit / BigInteger_base) | 0;
				partial[j] = digit % BigInteger_base;
			}
		}
		return new BigInteger(partial, this._s * n._s, CONSTRUCT);
	};

	// Multiply a BigInteger by a single-digit native number
	// Assumes that this and n are >= 0
	// This is not really intended to be used outside the library itself
	BigInteger.prototype.multiplySingleDigit = function(n) {
		if (n === 0 || this._s === 0) {
			return ZERO;
		}
		if (n === 1) {
			return this;
		}

		var digit;
		if (this._d.length === 1) {
			digit = this._d[0] * n;
			if (digit >= BigInteger_base) {
				return new BigInteger([(digit % BigInteger_base)|0,
						(digit / BigInteger_base)|0], 1, CONSTRUCT);
			}
			return new BigInteger([digit], 1, CONSTRUCT);
		}

		if (n === 2) {
			return this.add(this);
		}
		if (this.isUnit()) {
			return new BigInteger([n], 1, CONSTRUCT);
		}

		var a = this._d;
		var al = a.length;

		var pl = al + 1;
		var partial = new Array(pl);
		for (var i = 0; i < pl; i++) {
			partial[i] = 0;
		}

		var carry = 0;
		for (var j = 0; j < al; j++) {
			digit = n * a[j] + carry;
			carry = (digit / BigInteger_base) | 0;
			partial[j] = (digit % BigInteger_base) | 0;
		}
		if (carry) {
			partial[j] = carry;
		}

		return new BigInteger(partial, 1, CONSTRUCT);
	};

	/*
		Function: square
		Multiply a <BigInteger> by itself.

		This is slightly faster than regular multiplication, since it removes the
		duplicated multiplcations.

		Returns:

			> this.multiply(this)

		See Also:
			<multiply>
	*/
	BigInteger.prototype.square = function() {
		// Normally, squaring a 10-digit number would take 100 multiplications.
		// Of these 10 are unique diagonals, of the remaining 90 (100-10), 45 are repeated.
		// This procedure saves (N*(N-1))/2 multiplications, (e.g., 45 of 100 multiplies).
		// Based on code by Gary Darby, Intellitech Systems Inc., www.DelphiForFun.org

		if (this._s === 0) {
			return ZERO;
		}
		if (this.isUnit()) {
			return ONE;
		}

		var digits = this._d;
		var length = digits.length;
		var imult1 = new Array(length + length + 1);
		var product, carry, k;
		var i;

		// Calculate diagonal
		for (i = 0; i < length; i++) {
			k = i * 2;
			product = digits[i] * digits[i];
			carry = (product / BigInteger_base) | 0;
			imult1[k] = product % BigInteger_base;
			imult1[k + 1] = carry;
		}

		// Calculate repeating part
		for (i = 0; i < length; i++) {
			carry = 0;
			k = i * 2 + 1;
			for (var j = i + 1; j < length; j++, k++) {
				product = digits[j] * digits[i] * 2 + imult1[k] + carry;
				carry = (product / BigInteger_base) | 0;
				imult1[k] = product % BigInteger_base;
			}
			k = length + i;
			var digit = carry + imult1[k];
			carry = (digit / BigInteger_base) | 0;
			imult1[k] = digit % BigInteger_base;
			imult1[k + 1] += carry;
		}

		return new BigInteger(imult1, 1, CONSTRUCT);
	};

	/*
		Function: quotient
		Divide two <BigIntegers> and truncate towards zero.

		<quotient> throws an exception if *n* is zero.

		Parameters:

			n - The number to divide *this* by. Will be converted to a <BigInteger>.

		Returns:

			The *this* / *n*, truncated to an integer.

		See Also:

			<add>, <subtract>, <multiply>, <divRem>, <remainder>
	*/
	BigInteger.prototype.quotient = function(n) {
		return this.divRem(n)[0];
	};

	/*
		Function: divide
		Deprecated synonym for <quotient>.
	*/
	BigInteger.prototype.divide = BigInteger.prototype.quotient;

	/*
		Function: remainder
		Calculate the remainder of two <BigIntegers>.

		<remainder> throws an exception if *n* is zero.

		Parameters:

			n - The remainder after *this* is divided *this* by *n*. Will be
			    converted to a <BigInteger>.

		Returns:

			*this* % *n*.

		See Also:

			<divRem>, <quotient>
	*/
	BigInteger.prototype.remainder = function(n) {
		return this.divRem(n)[1];
	};

	/*
		Function: divRem
		Calculate the integer quotient and remainder of two <BigIntegers>.

		<divRem> throws an exception if *n* is zero.

		Parameters:

			n - The number to divide *this* by. Will be converted to a <BigInteger>.

		Returns:

			A two-element array containing the quotient and the remainder.

			> a.divRem(b)

			is exactly equivalent to

			> [a.quotient(b), a.remainder(b)]

			except it is faster, because they are calculated at the same time.

		See Also:

			<quotient>, <remainder>
	*/
	BigInteger.prototype.divRem = function(n) {
		n = BigInteger(n);
		if (n._s === 0) {
			throw new Error("Divide by zero");
		}
		if (this._s === 0) {
			return [ZERO, ZERO];
		}
		if (n._d.length === 1) {
			return this.divRemSmall(n._s * n._d[0]);
		}

		// Test for easy cases -- |n1| <= |n2|
		switch (this.compareAbs(n)) {
		case 0: // n1 == n2
			return [this._s === n._s ? ONE : M_ONE, ZERO];
		case -1: // |n1| < |n2|
			return [ZERO, this];
		}

		var sign = this._s * n._s;
		var a = n.abs();
		var b_digits = this._d;
		var b_index = b_digits.length;
		var digits = n._d.length;
		var quot = [];
		var guess;

		var part = new BigInteger([], 0, CONSTRUCT);
		part._s = 1;

		while (b_index) {
			part._d.unshift(b_digits[--b_index]);

			if (part.compareAbs(n) < 0) {
				quot.push(0);
				continue;
			}
			if (part._s === 0) {
				guess = 0;
			}
			else {
				var xlen = part._d.length, ylen = a._d.length;
				var highx = part._d[xlen-1]*BigInteger_base + part._d[xlen-2];
				var highy = a._d[ylen-1]*BigInteger_base + a._d[ylen-2];
				if (part._d.length > a._d.length) {
					// The length of part._d can either match a._d length,
					// or exceed it by one.
					highx = (highx+1)*BigInteger_base;
				}
				guess = Math.ceil(highx/highy);
			}
			do {
				var check = a.multiplySingleDigit(guess);
				if (check.compareAbs(part) <= 0) {
					break;
				}
				guess--;
			} while (guess);

			quot.push(guess);
			if (!guess) {
				continue;
			}
			var diff = part.subtract(check);
			part._d = diff._d.slice();
			if (part._d.length === 0) {
				part._s = 0;
			}
		}

		return [new BigInteger(quot.reverse(), sign, CONSTRUCT),
			   new BigInteger(part._d, this._s, CONSTRUCT)];
	};

	// Throws an exception if n is outside of (-BigInteger.base, -1] or
	// [1, BigInteger.base).  It's not necessary to call this, since the
	// other division functions will call it if they are able to.
	BigInteger.prototype.divRemSmall = function(n) {
		var r;
		n = +n;
		if (n === 0) {
			throw new Error("Divide by zero");
		}

		var n_s = n < 0 ? -1 : 1;
		var sign = this._s * n_s;
		n = Math.abs(n);

		if (n < 1 || n >= BigInteger_base) {
			throw new Error("Argument out of range");
		}

		if (this._s === 0) {
			return [ZERO, ZERO];
		}

		if (n === 1 || n === -1) {
			return [(sign === 1) ? this.abs() : new BigInteger(this._d, sign, CONSTRUCT), ZERO];
		}

		// 2 <= n < BigInteger_base

		// divide a single digit by a single digit
		if (this._d.length === 1) {
			var q = new BigInteger([(this._d[0] / n) | 0], 1, CONSTRUCT);
			r = new BigInteger([(this._d[0] % n) | 0], 1, CONSTRUCT);
			if (sign < 0) {
				q = q.negate();
			}
			if (this._s < 0) {
				r = r.negate();
			}
			return [q, r];
		}

		var digits = this._d.slice();
		var quot = new Array(digits.length);
		var part = 0;
		var diff = 0;
		var i = 0;
		var guess;

		while (digits.length) {
			part = part * BigInteger_base + digits[digits.length - 1];
			if (part < n) {
				quot[i++] = 0;
				digits.pop();
				diff = BigInteger_base * diff + part;
				continue;
			}
			if (part === 0) {
				guess = 0;
			}
			else {
				guess = (part / n) | 0;
			}

			var check = n * guess;
			diff = part - check;
			quot[i++] = guess;
			if (!guess) {
				digits.pop();
				continue;
			}

			digits.pop();
			part = diff;
		}

		r = new BigInteger([diff], 1, CONSTRUCT);
		if (this._s < 0) {
			r = r.negate();
		}
		return [new BigInteger(quot.reverse(), sign, CONSTRUCT), r];
	};

	/*
		Function: isEven
		Return true iff *this* is divisible by two.

		Note that <BigInteger.ZERO> is even.

		Returns:

			true if *this* is even, false otherwise.

		See Also:

			<isOdd>
	*/
	BigInteger.prototype.isEven = function() {
		var digits = this._d;
		return this._s === 0 || digits.length === 0 || (digits[0] % 2) === 0;
	};

	/*
		Function: isOdd
		Return true iff *this* is not divisible by two.

		Returns:

			true if *this* is odd, false otherwise.

		See Also:

			<isEven>
	*/
	BigInteger.prototype.isOdd = function() {
		return !this.isEven();
	};

	/*
		Function: sign
		Get the sign of a <BigInteger>.

		Returns:

			* -1 if *this* < 0
			* 0 if *this* == 0
			* +1 if *this* > 0

		See Also:

			<isZero>, <isPositive>, <isNegative>, <compare>, <BigInteger.ZERO>
	*/
	BigInteger.prototype.sign = function() {
		return this._s;
	};

	/*
		Function: isPositive
		Return true iff *this* > 0.

		Returns:

			true if *this*.compare(<BigInteger.ZERO>) == 1.

		See Also:

			<sign>, <isZero>, <isNegative>, <isUnit>, <compare>, <BigInteger.ZERO>
	*/
	BigInteger.prototype.isPositive = function() {
		return this._s > 0;
	};

	/*
		Function: isNegative
		Return true iff *this* < 0.

		Returns:

			true if *this*.compare(<BigInteger.ZERO>) == -1.

		See Also:

			<sign>, <isPositive>, <isZero>, <isUnit>, <compare>, <BigInteger.ZERO>
	*/
	BigInteger.prototype.isNegative = function() {
		return this._s < 0;
	};

	/*
		Function: isZero
		Return true iff *this* == 0.

		Returns:

			true if *this*.compare(<BigInteger.ZERO>) == 0.

		See Also:

			<sign>, <isPositive>, <isNegative>, <isUnit>, <BigInteger.ZERO>
	*/
	BigInteger.prototype.isZero = function() {
		return this._s === 0;
	};

	/*
		Function: exp10
		Multiply a <BigInteger> by a power of 10.

		This is equivalent to, but faster than

		> if (n >= 0) {
		>     return this.multiply(BigInteger("1e" + n));
		> }
		> else { // n <= 0
		>     return this.quotient(BigInteger("1e" + -n));
		> }

		Parameters:

			n - The power of 10 to multiply *this* by. *n* is converted to a
			javascipt number and must be no greater than <BigInteger.MAX_EXP>
			(0x7FFFFFFF), or an exception will be thrown.

		Returns:

			*this* * (10 ** *n*), truncated to an integer if necessary.

		See Also:

			<pow>, <multiply>
	*/
	BigInteger.prototype.exp10 = function(n) {
		n = +n;
		if (n === 0) {
			return this;
		}
		if (Math.abs(n) > Number(MAX_EXP)) {
			throw new Error("exponent too large in BigInteger.exp10");
		}
		if (n > 0) {
			var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);

			for (; n >= BigInteger_base_log10; n -= BigInteger_base_log10) {
				k._d.unshift(0);
			}
			if (n == 0)
				return k;
			k._s = 1;
			k = k.multiplySingleDigit(Math.pow(10, n));
			return (this._s < 0 ? k.negate() : k);
		} else if (-n >= this._d.length*BigInteger_base_log10) {
			return ZERO;
		} else {
			var k = new BigInteger(this._d.slice(), this._s, CONSTRUCT);

			for (n = -n; n >= BigInteger_base_log10; n -= BigInteger_base_log10) {
				k._d.shift();
			}
			return (n == 0) ? k : k.divRemSmall(Math.pow(10, n))[0];
		}
	};

	/*
		Function: pow
		Raise a <BigInteger> to a power.

		In this implementation, 0**0 is 1.

		Parameters:

			n - The exponent to raise *this* by. *n* must be no greater than
			<BigInteger.MAX_EXP> (0x7FFFFFFF), or an exception will be thrown.

		Returns:

			*this* raised to the *nth* power.

		See Also:

			<modPow>
	*/
	BigInteger.prototype.pow = function(n) {
		if (this.isUnit()) {
			if (this._s > 0) {
				return this;
			}
			else {
				return BigInteger(n).isOdd() ? this : this.negate();
			}
		}

		n = BigInteger(n);
		if (n._s === 0) {
			return ONE;
		}
		else if (n._s < 0) {
			if (this._s === 0) {
				throw new Error("Divide by zero");
			}
			else {
				return ZERO;
			}
		}
		if (this._s === 0) {
			return ZERO;
		}
		if (n.isUnit()) {
			return this;
		}

		if (n.compareAbs(MAX_EXP) > 0) {
			throw new Error("exponent too large in BigInteger.pow");
		}
		var x = this;
		var aux = ONE;
		var two = BigInteger.small[2];

		while (n.isPositive()) {
			if (n.isOdd()) {
				aux = aux.multiply(x);
				if (n.isUnit()) {
					return aux;
				}
			}
			x = x.square();
			n = n.quotient(two);
		}

		return aux;
	};

	/*
		Function: modPow
		Raise a <BigInteger> to a power (mod m).

		Because it is reduced by a modulus, <modPow> is not limited by
		<BigInteger.MAX_EXP> like <pow>.

		Parameters:

			exponent - The exponent to raise *this* by. Must be positive.
			modulus - The modulus.

		Returns:

			*this* ^ *exponent* (mod *modulus*).

		See Also:

			<pow>, <mod>
	*/
	BigInteger.prototype.modPow = function(exponent, modulus) {
		var result = ONE;
		var base = this;

		while (exponent.isPositive()) {
			if (exponent.isOdd()) {
				result = result.multiply(base).remainder(modulus);
			}

			exponent = exponent.quotient(BigInteger.small[2]);
			if (exponent.isPositive()) {
				base = base.square().remainder(modulus);
			}
		}

		return result;
	};

	/*
		Function: log
		Get the natural logarithm of a <BigInteger> as a native JavaScript number.

		This is equivalent to

		> Math.log(this.toJSValue())

		but handles values outside of the native number range.

		Returns:

			log( *this* )

		See Also:

			<toJSValue>
	*/
	BigInteger.prototype.log = function() {
		switch (this._s) {
		case 0:	 return -Infinity;
		case -1: return NaN;
		default: // Fall through.
		}

		var l = this._d.length;

		if (l*BigInteger_base_log10 < 30) {
			return Math.log(this.valueOf());
		}

		var N = Math.ceil(30/BigInteger_base_log10);
		var firstNdigits = this._d.slice(l - N);
		return Math.log((new BigInteger(firstNdigits, 1, CONSTRUCT)).valueOf()) + (l - N) * Math.log(BigInteger_base);
	};

	/*
		Function: valueOf
		Convert a <BigInteger> to a native JavaScript integer.

		This is called automatically by JavaScipt to convert a <BigInteger> to a
		native value.

		Returns:

			> parseInt(this.toString(), 10)

		See Also:

			<toString>, <toJSValue>
	*/
	BigInteger.prototype.valueOf = function() {
		return parseInt(this.toString(), 10);
	};

	/*
		Function: toJSValue
		Convert a <BigInteger> to a native JavaScript integer.

		This is the same as valueOf, but more explicitly named.

		Returns:

			> parseInt(this.toString(), 10)

		See Also:

			<toString>, <valueOf>
	*/
	BigInteger.prototype.toJSValue = function() {
		return parseInt(this.toString(), 10);
	};

	var MAX_EXP = BigInteger(0x7FFFFFFF);
	// Constant: MAX_EXP
	// The largest exponent allowed in <pow> and <exp10> (0x7FFFFFFF or 2147483647).
	BigInteger.MAX_EXP = MAX_EXP;

	(function() {
		function makeUnary(fn) {
			return function(a) {
				return fn.call(BigInteger(a));
			};
		}

		function makeBinary(fn) {
			return function(a, b) {
				return fn.call(BigInteger(a), BigInteger(b));
			};
		}

		function makeTrinary(fn) {
			return function(a, b, c) {
				return fn.call(BigInteger(a), BigInteger(b), BigInteger(c));
			};
		}

		(function() {
			var i, fn;
			var unary = "toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log".split(",");
			var binary = "compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs".split(",");
			var trinary = ["modPow"];

			for (i = 0; i < unary.length; i++) {
				fn = unary[i];
				BigInteger[fn] = makeUnary(BigInteger.prototype[fn]);
			}

			for (i = 0; i < binary.length; i++) {
				fn = binary[i];
				BigInteger[fn] = makeBinary(BigInteger.prototype[fn]);
			}

			for (i = 0; i < trinary.length; i++) {
				fn = trinary[i];
				BigInteger[fn] = makeTrinary(BigInteger.prototype[fn]);
			}

			BigInteger.exp10 = function(x, n) {
				return BigInteger(x).exp10(n);
			};
		})();
	})();

	exports.BigInteger = BigInteger;
})(x);
	/*
		Port of BigInteger Library
		to follow method signatures of BigInt.js
	*/

	exports.int2bigInt = function(number){
		return x.BigInteger(number);
	};

	exports.str2bigInt = function(str, base){
		return x.BigInteger.parse(str, base);
	};

	exports.bigInt2str = function(bigInt, base){
		return bigInt.toString(base);
	};

	exports.equalsInt = function(bigInt, number){
		return bigInt.compare(x.BigInteger(number)) === 0 ? 1 : 0;
	};

	exports.equalsBigInt = function(bigInt, bigInt2){
		return bigInt.compare(bigInt2) === 0 ? 1 : 0;
	};

	exports.isZero = function(bigInt){
		return bigInt.isZero() ? 1 : 0;
	};

	exports.add = function(bigInt, bigInt2){
		return bigInt.add(bigInt2);
	};

	exports.sub = function(bigInt, bigInt2){
		return bigInt.subtract(bigInt2);
	};

	exports.mult = function(bigInt, bigInt2){
		return bigInt.multiply(bigInt2);
	};

	exports.powMod = function(bigInt, e, m){
		return bigInt.modPow(e,m);
	};

	exports.mod = function(bigInt, bigInt2){
		var remainder = bigInt.remainder(bigInt2);
		while (remainder.isNegative()) {
			var abs = bigInt2.isPositive() ? bigInt2 : bigInt2.negate();
			remainder = remainder.add(abs);
		}
		return remainder;
	};

	exports.modInt = function(bigInt, number){
		return mod(bigInt, int2bigInt(number));
	};

	exports.isNegative = function(bigInt){
		return bigInt.isNegative() ? 1 : 0;
	};

    var primes = [2, 3];
    var primes_lists = [];
    primes_lists[0] = list(2);
    primes_lists[1] = pair(3, primes_lists[0]);
    // Returns the n-th tail of the list, i.e., what remains after dropping the first n elements
    // TODO: now unused, shift back to list.js.tpl?
    function drop(xs, n) {
        if (n === 0) {
            return xs;
        } else {
            return drop(tail(xs), n - 1);
        }
    }
    exports.findPrimes = function(number) {
        var primes = [2, 3];
        var lst = list(3, 2);
        if (number < 2) return [];
        if (number < 3) return tail(lst);

        function isprime(number){
            for (var i = 0; i < primes.length && primes[i] <= Math.sqrt(number); ++i) {
                if (number % primes[i] === 0) {
                    return false;
                }
            }
            return true;
        };
        for (var i = primes[primes.length - 1] + 2; i < number; i += 2) {
            if (isprime(i)) {
                primes.push(i);
                lst = pair(i, lst);
            }
        }
        return lst;
    }
    var findPrimes2 = function(number){
		function isprime(number){
			for (var i = 0; i < primes.length && primes[i] <= Math.sqrt(number); ++i) {
				if (number % primes[i] === 0) {
					return false;
				}
			}
			return true;
		};

        if (number < 2) return tail(tail(primes_lists[0]));
        if (number < 3) return tail(primes_lists[0]);

        if (number <= primes[primes.length - 1]) {
            var l = 0, h = primes.length, m = Math.floor((l + h) / 2), found;
            while (h > l) {
                found = false;
                if (primes[m] >= number) {
                    h = m;
                } else if (primes[m + 1] < number) {
                    l = m + 1;
                } else {
                    found = true;
                }
                if (found) {
                    return primes_lists[m];
                } else {
                    m = Math.floor((l + h) / 2);
                }
            }
        }

		for (var i = primes[primes.length - 1] + 2; i < number; i += 2) {
			if (isprime(i)) {
				primes.push(i);
                primes_lists.push(pair(i, primes_lists[primes_lists.length - 1]));
			}
		}

		return primes_lists[primes_lists.length - 1];
	};

	exports.addInt = function(bigInt, number){
		return add(bigInt, int2bigInt(number));
	};

	exports.greater = function(bigInt1, bigInt2){
		if (bigInt1.compare(bigInt2) === 1) {
			return 1;
		} else {
			return 0;
		}
	};

	exports.GCD = function(bigInt1, bigInt2){
		if (isZero(bigInt2)) {
			return bigInt1;
		} else {
			return GCD(bigInt2, mod(bigInt1, bigInt2));
		}
	};
})(window);


/*
Notes for library maintainer:
1)	Remember to include "list.js" and "BigInt.js"
2)	Everything except conversion functions (e.g. charlist_to_integer) are all in BigInt
3)	All boolean returns are actually 1 and 0 instead of true and false
4)	I use 10 bits and array of size 10 for BigInt conversions.
	It seems large enough and easy to remember.
	It'll auto resize the array after a BigInt.js operation anyway, so no worries.
5)	We're dealing with big numbers here. Please be careful with your recursive solutions that we don't
	stack overflow.
*/

//------------------------------------------------------------
// RSA-specific functions
function is_even(x) {
	return (modInt(x,2) === 0);
}

function int_to_string(integer) {
    return integer.toString(10); // Base 10
}

function string_to_int(string) {
	return parseInt(string,10); // Base 10
}

function int_to_bigInt(x) {
    return str2bigInt(int_to_string(x),10,10,10);
}

function str_to_bigInt(s) {
    return str2bigInt(s,10,10,10);
}

function bigInt_to_int(bi) {
	return string_to_int(bigInt2str(bi,10));
}

function bigInt_GCD_is_1(x,y) {
    return (equalsInt(GCD(x,y),1) === 1 && equalsInt(GCD(y,x),1) === 1);
}

function quotient(num, div) {
	var rem = remainder(num, div);
	return (num - rem) / div;
}

function remainder(num, div) {
	return mod(num, div);
}

function square(x) {
	return mult(x,x);
}

function string_to_list(str) {
	if (str.length === 0)
		return [];
	else
		return pair(str[0],string_to_list(str.substring(1))); // Omitted "to" in substring = until end of string
}

// As opposed to list_to_string in "list.js" which returns lists in [] notation
function list_to_string_without_brackets(lst) {
	if (length(lst) === 1)
		return head(lst);
	else
		return head(lst) + list_to_string_without_brackets(tail(lst));
}

function make_string(num, character) {
	function make_list(num, character) {
		if (num === 0)
			return [];
		else
			return pair(character, make_list(num-1,character));
	}

	return list_to_string_without_brackets(make_list(num, character));
}

function string_append() {
	if (arguments.length < 2)
		console.log("Error. Invalid number of arguments");
	else {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			result = result.concat(arguments[i]);
		}
		return result;
	}
}

function modulo(num, modval) {
	return remainder(num, modval);
}

function positify(front,sum,n) {
	if (front - sum - n < 0)
		return positify(front + n, sum, n);
	else
		return front;
}

function integer_to_char(integer) {
	return String.fromCharCode(integer);
}

// From javascript.js (but apparently missing in list.js and misc.js)
function apply(f,xs) {
    var args = [];
    var len = length(xs);
    for (var i=0; i < len; i++) {
       args[i] = head(xs);
       xs = tail(xs);
    }
    return f.apply(f,args);
}

// Use this instead of append() because append() only works for 2 lists
function append2() {
	if (arguments.length < 2) {
		return arguments[0];
	} else if (arguments.length === 2) {
		return append(arguments[0],arguments[1]);
	} else {
		var front = arguments[0];
		var back = [];
		for (var i = 1; i < arguments.length; i++) {
			back[i-1] = arguments[i];
		}
		return append(front, append2.apply(append2,back));
	}
}

//------------------------------------------------------------

function expmod(b,e,m) {
	return powMod(b, e, m);
}

// An RSA key consists of a modulus and an exponent.

var make_key = pair;
var key_modulus = head;
var key_exponent = tail;

function RSA_transform(number,key) {
	return expmod(number,
                  int_to_bigInt(key_exponent(key)),
                  int_to_bigInt(key_modulus(key)));
}

// generating RSA keys

// To choose a prime, we start searching at a random odd number in a specified range
// Warning: Due to unknown reasons in BigInt.js, the result is MOST PROBABLY a prime,
//          but beware, it might not be
function choose_prime(smallest,range) {
	var start = bigInt_to_int(add(smallest, choose_random(range)));

	if (start % 2 === 0)
		return search_for_prime(start + 1);
	else
		return search_for_prime(start);
}

function search_for_prime(guess) {
    if (prime_test(guess)) {
        return guess;
    } else {
        return search_for_prime(guess + 2);
    }
}

// Workaround: convert n to int, do the usual stuff, then convert back
// Why: Because BigInt.js doesn't have a suitable random function
function choose_random(n) {
	var max_random_number = Math.pow(2,31)-1;
	var n2 = bigInt_to_int(n);
	return int_to_bigInt(Math.floor(Math.random() * Math.min(n2, max_random_number)));
    // Math.random() gives a value between 0 and 1
}

// BigInt.js has a nice functionality to check for primes.
function prime_test(n) {
    var primes = findPrimes(n + 1); // Returns all the primes < n + 1 in a list
    return (n === head(primes)); // Check if the greatest prime (the head of the list) === n
}

// RSA key pairs are pairs of keys

var make_key_pair = pair;
var key_pair_public = head;
var key_pair_private = tail;

// generate an RSA key pair (k1, k2).  This has the property that
// transforming by k1 and transforming by k2 are inverse operations.
// Thus, we can use one key as the public key andone as the private key.

function generate_RSA_key_pair() {
    var size = powMod(int_to_bigInt(2),
                      int_to_bigInt(14),
                      int_to_bigInt(9999999999));

    // we choose p and q in the range from 2^14 to 2^15.  This insures
    // that the pq will be in the range 2^28 to 2^30, which is large
    // enough to encode four characters per number.

    var p = int_to_bigInt(choose_prime(size,size));
    var q = int_to_bigInt(choose_prime(size,size));

    if (equalsBigInt(p,q) === 1) { // check that we haven't chosen the same prime twice
        return generate_RSA_key_pair();
    } else {
        var n = mult(p,q);
        var m = mult(addInt(p, -1), addInt(q, -1));
        var e = select_exponent(m);
        var d = invert_modulo(e,m);

        // In case either p or q (or both) is not prime
        if (is_string(d) && d === "gcd not 1") {
            return generate_RSA_key_pair();
        } else {
            return make_key_pair(make_key(n, e), make_key(n, d));
        }
    }
}

// The RSA exponent can be any random number relatively prime to m

function select_exponent(m) {
    var try_this = choose_random(m);
    if (bigInt_GCD_is_1(try_this,m)) {
        return try_this;
    } else {
        return select_exponent(m);
    }
}

// Invert e modulo m

function invert_modulo(e,m) {
	if (bigInt_GCD_is_1(e,m)) {
		var solved_tail = tail(solve_ax_plus_by_eq_1(bigInt_to_int(m),bigInt_to_int(e)));

		if (solved_tail < 0)
			solved_tail = positify(solved_tail,0,bigInt_to_int(m));

		return modulo(int_to_bigInt(solved_tail),m); // just in case y was negative
	} else {
		console.log("gcd not 1 " + e + " " + m);
        return "gcd not 1";
	}
}

// Actual RSA encryption and decryption

function RSA_encrypt(string,key1) {
	return RSA_convert_list(string_to_intlist(string), key1);
}

function RSA_convert_list(intlist, key) {
    var n = int_to_bigInt(key_modulus(key));
    var bigIntList = map(int_to_bigInt, intlist);

    function convert(lst, sum) {
        if (is_empty_list(lst)) {
            return [];
        } else {
            var front = head(lst);
            var x = RSA_transform(modulo(sub(front, sum), n), key);
            return pair(bigInt_to_int(x), convert(tail(lst), x));
        }
    }
    return convert(bigIntList, int_to_bigInt(0));
}

function RSA_decrypt(intlist,key2) {
	return intlist_to_string(RSA_unconvert_list(intlist,key2));
}

// The following routine compresses a list of numbers to a single
// number for use in creating digital signatures.

function compress(intlist) {
    function add_loop(l) {
        if (is_empty_list(l))
            return int_to_bigInt(0);
        else
            return add(int_to_bigInt(head(l)),
                       add_loop(tail(l)));
    }

    return modulo(add_loop(intlist),
                  powMod(int_to_bigInt(2),
                         int_to_bigInt(28),
                         int_to_bigInt(9999999999)));
}

// searching for divisors.
function smallest_divisor(n) {
	return find_divisor(n,int_to_bigInt(3));
}

function find_divisor(n, test_divisor) {
	for ( ; ; ) {
		if (greater(square(test_divisor), n) === 1) {
			return n;
		} else if (is_divides(test_divisor, n)) {
			return test_divisor;
		} else {
			test_divisor = addInt(test_divisor, 2);
		}
	}
}

function is_divides(a,b) {
	return (equalsInt(mod(b,a),0) === 1);
}

// converting between strings and numbers

// The following procedures are used to convert between strings, and
// lists of integers in the range 0 through 2^28.  You are not
// responsible for studying this code -- just use it.

// Convert a string into a list of integers, where each integer
// encodes a block of characters.  Pad the string with spaces if the
// length of the string is not a multiple of the blocksize

function string_to_intlist(string) {
	var blocksize = 4;
	var padded_string = pad_string(string,blocksize);
	var length = padded_string.length;
	return block_convert(padded_string, 0, length, blocksize);
}

function block_convert(string, start_index, end_index, blocksize) {
	if (start_index === end_index)
		return [];
	else {
		var block_end = start_index + blocksize;
		return pair(charlist_to_integer(string_to_list(string.substring(start_index, block_end))),
					block_convert(string, block_end, end_index, blocksize));
	}
}

function pad_string(string,blocksize) {
	var rem = string.length % blocksize;
	if (rem === 0)
		return string;
	else
		return string_append(string, make_string(blocksize - rem, ' '));
}

// Encode a list of characters as a single number
// Each character gets converted to an ascii code between 0 and 127.
// Then the resulting number is c[0]+c[1]*128+c[2]*128^2,...

function charlist_to_integer(charlist) {
	var n = head(charlist).charCodeAt(0);
	if (is_empty_list(tail(charlist)))
		return n;
	else
		return n+(128*(charlist_to_integer(tail(charlist))));
}

// Convert a list of integers to a string. (Inverse of
// string->intlist, except for the padding.)

function intlist_to_string(intlist) {
	return list_to_string_without_brackets(apply(append2, map(integer_to_charlist, intlist)));
}

// Decode an integer into a list of characters.  (This is essentially
// writing the integer in base 128, and converting each "digit" to a
// character.)

function integer_to_charlist(integer) {
	if (integer < 128) {
		return (list (integer_to_char(integer)));
	}
	else {
		var bigInteger = int_to_bigInt(integer);
		var big128 = int_to_bigInt(128);
		return pair(integer_to_char(bigInt_to_int(remainder(bigInteger,
															big128))),
					integer_to_charlist(quotient(bigInteger, big128)));
	}
}

/*
----------------------
From previous Missions
----------------------
*/
function RSA_unconvert_list(intlist, key) {
    var n = int_to_bigInt(key_modulus(key));
    function unconvert(l, sum) {
        if (is_empty_list(l))
            return [];
        else {
            var front = int_to_bigInt(head(l));
            var x = RSA_transform(front, key);
            return pair(bigInt_to_int(modulo(add(x,sum), n)),
                        unconvert(tail(l), front));
        }
    }

    return unconvert(intlist, int_to_bigInt(0));
}
/*
----------------------
From previous Missions
----------------------
*/

// Some initial test data

var test_key_pair1 = make_key_pair(	make_key(385517963, 90747943),
									make_key(385517963, 137332327));
var test_key_pair2 = make_key_pair( make_key(432208237, 282377377),
									make_key(432208237, 401849313));

var test_public_key1 = key_pair_public(test_key_pair1);
var test_private_key1 = key_pair_private(test_key_pair1);

var test_public_key2 = key_pair_public(test_key_pair2);
var test_private_key2 = key_pair_private(test_key_pair2);

// Public keys of involved parties.

var Darth_public_key = make_key(718392397, 559318161);
var Darth_private_key = make_key(718392397, 708457521);

var Alice_public_key = make_key(998036089, 806109659);
var Ben_public_key = make_key(504839983, 227999945);
var Chris_public_key = make_key(864136379, 572774993);
var David_public_key = make_key(733058129, 420349319);
var Eli_public_key = make_key(400984687, 70529231);

var suspects = list(
	pair("Alice", Alice_public_key),
	pair("Ben", Ben_public_key),
	pair("Chris", Chris_public_key),
	pair("David", David_public_key),
	pair("Eli", Eli_public_key)
);

// message received by Darth -- Who sent it?
var received_mystery_message =
	list(255535865, 487823975, 233970006, 402199677, 684685730,
		495370893, 505793783, 430488766, 706214252, 701906712, 655642115, 126643950, 413709710, 612383998, 293307552, 137229038, 373162139, 74856121, 686648335, 241857262, 112709882, 707756613, 538397565, 396339326, 487378368, 485190980, 576812205, 9681481, 664316990, 678425577, 475392983, 606142787, 7535084, 716541718, 285444540, 174501946, 698937559, 467618088, 305183643, 367171717, 208907481, 291907945, 297670959, 716955091, 359185042, 283957531, 473555999, 246483861,  346569080, 156601427, 357675208, 675926213, 295266635, 26539779, 20862356, 355946931, 329859765, 64364667);

var received_mystery_signature = 686875143;
export_symbol('int2bigInt', int2bigInt);
export_symbol('str2bigInt', str2bigInt);
export_symbol('bigInt2str', bigInt2str);
export_symbol('equalsInt', equalsInt);
export_symbol('equalsBigInt', equalsBigInt);
export_symbol('isZero', isZero);
export_symbol('add', add);
export_symbol('sub', sub);
export_symbol('mult', mult);
export_symbol('powMod', powMod);
export_symbol('mod', mod);
export_symbol('modInt', modInt);
export_symbol('isNegative', isNegative);
export_symbol('findPrimes', findPrimes);
export_symbol('addInt', addInt);
export_symbol('greater', greater);
export_symbol('GCD', GCD);
export_symbol('is_even', is_even);
export_symbol('int_to_string', int_to_string);
export_symbol('string_to_int', string_to_int);
export_symbol('int_to_bigInt', int_to_bigInt);
export_symbol('str_to_bigInt', str_to_bigInt);
export_symbol('bigInt_to_int', bigInt_to_int);
export_symbol('bigInt_GCD_is_1', bigInt_GCD_is_1);
export_symbol('quotient', quotient);
export_symbol('remainder', remainder);
export_symbol('square', square);
export_symbol('string_to_list', string_to_list);
export_symbol('list_to_string_without_brackets', list_to_string_without_brackets);
export_symbol('make_string', make_string);
export_symbol('string_append', string_append);
export_symbol('modulo', modulo);
export_symbol('positify', positify);
export_symbol('integer_to_char', integer_to_char);
export_symbol('apply', apply);
export_symbol('append2', append2);
export_symbol('expmod', expmod);
export_symbol('make_key', make_key);
export_symbol('key_modulus', key_modulus);
export_symbol('key_exponent', key_exponent);
export_symbol('RSA_transform', RSA_transform);
export_symbol('choose_prime', choose_prime);
export_symbol('search_for_prime', search_for_prime);
export_symbol('choose_random', choose_random);
export_symbol('prime_test', prime_test);
export_symbol('make_key_pair', make_key_pair);
export_symbol('key_pair_public', key_pair_public);
export_symbol('key_pair_private', key_pair_private);
export_symbol('generate_RSA_key_pair', generate_RSA_key_pair);
export_symbol('select_exponent', select_exponent);
export_symbol('invert_modulo', invert_modulo);
export_symbol('RSA_encrypt', RSA_encrypt);
export_symbol('RSA_convert_list', RSA_convert_list);
export_symbol('RSA_decrypt', RSA_decrypt);
export_symbol('compress', compress);
export_symbol('smallest_divisor', smallest_divisor);
export_symbol('find_divisor', find_divisor);
export_symbol('is_divides', is_divides);
export_symbol('string_to_intlist', string_to_intlist);
export_symbol('block_convert', block_convert);
export_symbol('pad_string', pad_string);
export_symbol('charlist_to_integer', charlist_to_integer);
export_symbol('intlist_to_string', intlist_to_string);
export_symbol('integer_to_charlist', integer_to_charlist);
export_symbol('test_key_pair1', test_key_pair1);
export_symbol('test_key_pair2', test_key_pair2);
export_symbol('test_public_key2', test_public_key2);
export_symbol('test_private_key2', test_private_key2);
export_symbol('test_private_key1', test_private_key1);
export_symbol('test_public_key1', test_public_key1);
export_symbol('RSA_unconvert_list', RSA_unconvert_list);
export_symbol('Darth_public_key', Darth_public_key);
export_symbol('Darth_private_key', Darth_private_key);
export_symbol('Alice_public_key', Alice_public_key);
export_symbol('Ben_public_key', Ben_public_key);
export_symbol('Chris_public_key', Chris_public_key);
export_symbol('David_public_key', David_public_key);
export_symbol('Eli_public_key', Eli_public_key);
export_symbol('suspects', suspects);
export_symbol('received_mystery_message', received_mystery_message);
export_symbol('received_mystery_signature', received_mystery_signature);
})(window);

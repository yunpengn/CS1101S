var interpreter = 9;
var mission_type = 'deathcube';
var timeout = '';
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
function is_null(xs) {
	return xs === null;
}

function is_undefined(xs) {
	return typeof xs === "undefined";
}

function is_number(xs) {
	return typeof xs === "number";
}

function is_string(xs) {
	return typeof xs === "string";
}

function is_boolean(xs) {
	return typeof xs === "boolean";
}

function is_object(xs) {
	return typeof xs === "object" || is_function(xs);
}

function is_function(xs) {
	return typeof xs === "function";
}

function is_NaN(x) {
	return is_number(x) && isNaN(x);
}

function has_own_property(obj,p) {
	return obj.hasOwnProperty(p);
}

function is_array(a){
	return a instanceof Array;
}

/**
 * @deprecated Use timed instead.
 * @returns The current time, in milliseconds, from the Unix Epoch.
 */
function runtime() {
	var d = new Date();
	return d.getTime();
}

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
function error(message, line) {
	throw new SyntaxError(message, null,
		line === undefined ? undefined : line + 1);
}

function newline() {
	display("\n");
}

function random(k){
	return Math.floor(Math.random()*k);
}

function timed(f) {
	var self = this;
	var timerType = window.performance ? performance : Date;
	return function() {
		var start = timerType.now();
		var result = f.apply(self, arguments);
		var diff = (timerType.now() - start);
		console.log('Duration: ' + Math.round(diff) + 'ms');
		return result;
	};
}
function read(x) {
	return prompt(x);
}

function write(x) {
	return alert(x);
}

function apply_in_underlying_javascript(prim,argument_list) {
   var argument_array = list_to_vector(argument_list);

   //Call prim with the same this argument as what we are running under.
   //this is populated with an object reference when we are an object. We
   //are not in this context, so this will usually be the window. Thus
   //passing this as the argument shouls behave. (Notably, passing the
   //function itself as a value of this is bad: if the function that is being
   //called assumes this to be window, we'll clobber the function value instead.
   //Also, alert won't work if we pass prim as the first argument.)
   return prim.apply(this, argument_array);
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function display_message(str){
    display(str);
}

function create_viewport(name, x, y, horiz, vert, win){	
    var canvas              = document.createElement("canvas");
    canvas.width            = horiz;
    canvas.height           = vert;
    canvas.style.width      = horiz + "px";
    canvas.style.height     = vert + "px";
    canvas.style.position   = "absolute";
    canvas.style.left       = x + "px";
    canvas.style.top        = y + "px";
    canvas.style.border     = "black 1px solid";

	win.appendChild(canvas);
    return canvas;
}
function clear_frame(canvas, color){
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function draw_rect(canvas, x, y, w, h, color, fill){
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "butt";
    ctx.lineWidth = 1;
    if(fill){
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }else{
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);
    }
}

function draw_circle(canvas, x, y, r, color, fill){
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "butt";
    ctx.lineWidth = 1;
    ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    if(fill){
        ctx.fillStyle = color;
        ctx.fill();
    }else{
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

function draw_line(canvas, x1, y1, x2, y2, color, width, cap){
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.lineCap = cap;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.moveTo(x2, y2);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function draw_text(canvas, text, x, y, color, fill, font){
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "butt";
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.font = font;
    if(fill){
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }else{
        ctx.strokeStyle = color;
        ctx.strokeText(text, x, y);
    }
}
  
function draw_up_arrow(canvas, x, y, length, color){
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "butt";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y+length);
    ctx.lineTo(x+length, y);
    ctx.lineTo(x+(length/2), y);
    ctx.lineTo(x+length, y+(length/2));
    ctx.lineTo(x+length, y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function draw_down_arrow(canvas, x, y, length, color){
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "butt";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y+length);
    ctx.lineTo(x+(length/2), y+length);
    ctx.lineTo(x, y+(length/2));
    ctx.lineTo(x, y+length);
    ctx.lineTo(x+length, y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function create_panel(name, x, y, horiz, vert, bgcolor, win){
    var panel                   = document.createElement("div");
    panel.style.width           = horiz + "px";
    panel.style.height          = vert + "px";
    panel.style.backgroundColor = bgcolor;
    panel.style.position        = "absolute";
    panel.style.left            = x + "px";
    panel.style.top             = y + "px";
    panel.style.border          = "black 1px solid";
	panel.style.color			= "black";
    win.appendChild(panel);
    return panel;
}

function ui_clear(panel){
    panel.innerHTML = "";
}

function ui_write(panel, text){
    panel.innerHTML = panel.innerHTML+"<br>"+text;
}

function make_button(name, parent, callback){
    var container = document.createElement("div");
    var newButt = document.createElement("input");
 
    newButt.setAttribute("type", "button");
    newButt.setAttribute("name", name);
    set_button_text(newButt, name);
    set_button_callback(newButt, callback);

    container.setAttribute("style", "text-align:center;");
    container.appendChild(newButt);
    parent.appendChild(container);
    
    return newButt;
}

function set_button_text(button, newText){
    button.setAttribute("value", newText);
}

function set_button_callback(button, newCallback){
    button.onclick = newCallback;

}

function create_window() {
	var d 					= document.createElement("div");
	d.style.width			= "100%";
	d.style.height			= "100%";
	d.style.position		= "fixed";
	d.style.left			= 0;
	d.style.top				= 0;
	d.style.backgroundColor = COL_WHITE;
	d.style["z-index"]		= 12000;
	window.document.body.appendChild(d);
	return d;
}

function kill_window(win) {
	document.body.removeChild(win);
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// config

var CONF_MIN_INERTIA 	= 2;
var CONF_MAX_INERTIA 	= 4;
var CONF_DRONE_CARD	    = false;	
var CONF_DRONE_BOT	    = true;
var CONF_ALARM_CYCLE	= 5;
var CONF_MAX_DRONES	    = 30;
var CONF_RECOVER_TIME	= 3;

// constants

const OPPOSITE_DIR	    = {north: "south", south: "north", east: "west", west: "east", up: "down", down: "up"};

const COL_BLACK		    = "Black";
const COL_RED		    = "Red";
const COL_BLUE		    = "Blue";
const COL_WHITE		    = "White";
const COL_GOLD		    = "Gold";
const COL_GRAY		    = "Gray";
const COL_PURPLE	    = "Purple";
const COL_ORANGE	    = "Orange";

const STYLE_LINE	    = 0;
const STYLE_CIRCLE  	= 1;

const ROOM_POS		    = -1;

const MOVE_COL		    = COL_GRAY;
const MOVE_STYLE	    = STYLE_LINE;
const MOVE_THICKNESS	= 6;
const MOVE_LIFETIME	    = 2;
const ATK_LIFETIME	    = 3;

// legend for layout

// combining properties with OR: a protected room with a generator = p|g
// checking properties with AND: is room a protected room? room&p (common is just room === c)

// 	0: common 	    1: protected 	2: link west 	4: link north 
//	8: link down 	16: generator 	32: start 	    64: bot
/*
Commented out because it screws with minifier

const c = 0;
const p = 1;
const w = 2;
const n	= 4;
const d	= 8;
const g	= 16;
const s	= 32;
const b	= 64;
*/
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//-------------------------------------------------------------------------
// NamedObject
//-------------------------------------------------------------------------
function NamedObject(name){
    this.__objName = name;
}
// For student use
NamedObject.prototype.getName = function(){
    return this.__objName;
}
// End of methods for student use
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------  
// Room
//-------------------------------------------------------------------------
function Room(name, x, y, z){
    const ROOM_MAX_CAP  = 5;

    this.__x            = x;
    this.__y            = y;
    this.__z            = z;
    this.__exits        = {};
    this.__things       = list();
    this.__occupants    = list();
    this.__maxCap       = ROOM_MAX_CAP;

    NamedObject.call(this, name);
}
Room.Inherits(NamedObject);
Room.__genRoom = null;
// For student use
Room.prototype.spaceLeft = function(){
    return this.__maxCap - length(this.__occupants);
}
Room.prototype.allowEntry = function(person){
    return (this.spaceLeft() > 0);
}
Room.prototype.getExit = function(dir){
    return this.__exits[dir] ? this.__exits[dir] : false;
}
Room.prototype.getExits = function() {
    var exitsList = [];
    for (var exit in this.__exits) {
        if (this.__exits[exit] instanceof Room)
            exitsList = pair(exit, exitsList);
    }
    return exitsList;
}
Room.prototype.getNeighbours = function() {
    var neighboursList = [];
    for (var exit in this.__exits) {
        if (this.__exits[exit] instanceof Room)
            neighboursList = pair(this.__exits[exit], neighboursList);
    }
    return neighboursList;
}
Room.prototype.getThings = function(){
    return this.__things;
}
Room.prototype.getOccupants = function(){
    return filter(function (occ) {return occ.getHealth() > 0}, this.__occupants);
}
// End of methods for student use
Room.prototype.__isConnected = function(room){
    return (!is_empty_list(member(room, this.getNeighbours())));
}
Room.prototype.__add = function(newEntity){
    if(newEntity instanceof Person){
        this.__addOccupant(newEntity);
    }else{
        this.__addThing(newEntity);
    }
}
Room.prototype.__addOccupant = function(newOccupant){
    if(!is_empty_list(member(newOccupant, this.__occupants))){
        display_message(newOccupant.getName() + " is already at " + this.getName());
    }else{
        this.__occupants = append(this.__occupants, list(newOccupant));
    }
}
Room.prototype.__addThing = function(newThing){
    if(!is_empty_list(member(newThing, this.__things))){
        display_message(newThing.getName() + " is already at " + this.getName());
    }else if(newThing instanceof Generator){
        if(Room.__genRoom == null){
            Room.__genRoom = this;
            this.__things = append(this.__things, list(newThing));
        }else{
            display_message("Generator room already exists at " + Room.__genRoom.getName());
        }
    }else{
        this.__things = append(this.__things, list(newThing));
    }
}
Room.prototype.__del = function(entity){
    if(entity instanceof Person){
        this.__delOccupant(entity);
    }else{
        this.__delThing(entity);
    }
}
Room.prototype.__delOccupant = function(occupant){
    if(is_empty_list(member(occupant, this.__occupants))){
        display_message(occupant.getName() + " is not at " + this.getName());
    }else{
        this.__occupants = remove(occupant, this.__occupants);
    }
}
Room.prototype.__delThing = function(thing){
    if(is_empty_list(member(thing, this.__things))){
        display_message(thing.getName() + " is not at " + this.getName());
    }else{
        this.__things = remove(thing, this.__things);
    }
}
Room.prototype.__getOccupantPos = function(occupant){
    var idx = 0;
    var occupants = this.getOccupants();
    while(!is_empty_list(occupants)){
        if(head(occupants) === occupant){
            return idx;
        }
        idx++;
        occupants = tail(occupants);
    }
    return -1;
}
Room.prototype.__resize = function(newCap){
    this.__maxCap = newCap;
}
Room.prototype.__setExit = function(dir, neighbour){
    var opp = OPPOSITE_DIR[dir];
    if(this.__exits[dir] instanceof Room){
        display_message(this.getName() + " already has a neighbour in the " + dir + " direction");
    }else if(neighbour.__exits[opp] instanceof Room){
        display_message(neighbour.getName() + " already has a neighbour in the " + opp + " direction");
    }else{
        this.__exits[dir] = neighbour;
        neighbour.__exits[opp] = this;
    }
}
Room.prototype.__getX = function(){
    return this.__x;
}
Room.prototype.__getY = function(){
    return this.__y;
}
Room.prototype.__getZ = function(){
    return this.__z;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// ProtectedRoom
//-------------------------------------------------------------------------
function ProtectedRoom(name, x, y, z){
	Room.call(this, name, x, y, z);
}
ProtectedRoom.Inherits(Room);
// For student use
ProtectedRoom.prototype.allowEntry = function(person){
    var authorized = person.__hasKeycard();
    var hasSpace = Room.prototype.allowEntry.call(this, person);
    return (authorized && hasSpace);
}
// End of methods for student use
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Ship
//-------------------------------------------------------------------------
function Ship(name){
    this.__entryPoints = [];
    this.__resize(Number.MAX_VALUE);
    Room.call(this, name, -1, -1, -1);
}
Ship.Inherits(Room);
Ship.prototype.__addEntryPoint = function(entryPoint){
    this.__entryPoints.push(entryPoint);
}
Ship.prototype.__deploy = function(){
    var occupants = this.getOccupants();
    while(!is_empty_list(occupants)){
        var occupant = head(occupants);
        if(occupant.__readyToDeploy()){
            var entryPoint = this.__getRandomEntryPoint(occupant);
            if(entryPoint !== null){
                occupant.__deploy(entryPoint);
            }else{
                break;
            }
        }
        occupants = tail(occupants);
    }
}
Ship.prototype.__getRandomEntryPoint = function(occupant){
    for(var i = 0; i < this.__entryPoints.length; i++){
        var randInd = Math.floor(Math.random()*this.__entryPoints.length);
        var temp = this.__entryPoints[i];
        this.__entryPoints[i] = this.__entryPoints[randInd];
        this.__entryPoints[randInd] = temp; 
    }
    for(var i = 0; i < this.__entryPoints.length; i++){
        if(this.__entryPoints[i].allowEntry(occupant)){
            return this.__entryPoints[i];
        }
    }    
    return null;
}
Ship.prototype.getOccupants = function() {
    return this.__occupants;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// MobileObject
//-------------------------------------------------------------------------
function MobileObject(name, location){
    this.__location    = location;
    NamedObject.call(this, name);
}
MobileObject.Inherits(NamedObject);
// For student use
MobileObject.prototype.getLocation = function(){
    return this.__location;
}
// End of methods for student use
MobileObject.prototype.__setLocation = function(newLocation){
    this.__location = newLocation;
}
MobileObject.prototype.__install = function(newLocation){
    newLocation.__add(this);
    this.__setLocation(newLocation);
}
MobileObject.prototype.__remove = function(oldLocation){
    this.__setLocation(null);
    oldLocation.__del(this);
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------  
// Generator
//-------------------------------------------------------------------------
function Generator(initLoc){
    const GEN_NAME        = "generator";
    this.__destroyed    = false;
    MobileObject.call(this, GEN_NAME, initLoc);
}
Generator.Inherits(MobileObject);
Generator.prototype.__destroy = function(){
    display_message(this.getName() + " is destroyed!");
    this.__destroyed = true;
}
Generator.prototype.__isDestroyed = function(){
    return this.__destroyed;
}

function MakeAndInstallGenerator(initLoc){
    var newGen = new Generator(initLoc);
    newGen.__install(newGen.getLocation());
    return newGen;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------  
// LivingThing
//-------------------------------------------------------------------------
function LivingThing(name, initLoc, health, regeneration){
    this.__health        = health;
    this.__maxHealth    = health;
    this.__regeneration    = regeneration;
    this.__deadFlag        = false;
    MobileObject.call(this, name, initLoc);
}
LivingThing.Inherits(MobileObject);
// For student use
LivingThing.prototype.getHealth = function(){
    return this.__health;
}
LivingThing.prototype.getMaxHealth = function(){
    return this.__maxHealth;
}
// End of methods for student use
LivingThing.prototype.__setHealth = function(newHealth){
    this.__health = newHealth;
}
LivingThing.prototype.__setMaxHealth = function(newMaxHealth){
    this.__maxHealth = newMaxHealth;
}
LivingThing.prototype.__setRegen = function(newRegen){
    this.__regeneration = newRegen;
}
LivingThing.prototype.__isDead = function(){
    return this.__deadFlag; 
}
LivingThing.prototype.__die = function(){
    this.__health = 0;
    this.__deadFlag = true; 
    display_message(this.getName() + " has been killed!");
}
LivingThing.prototype.__suffer = function(damage){
    damage = Math.floor(damage);
    if(damage === Number.MAX_VALUE){
        this.__die();
    }else if(damage > 0 && this.__health > 0){
        this.__health -= damage;
        display_message(this.getName() + " takes " + damage + " damage!");
        if(this.__health <= 0){
            this.__die();
        }
    }
}
LivingThing.prototype.__heal = function(amount){
    amount = Math.floor(amount);
    if(amount === Number.MAX_VALUE){
        this.__health = this.__maxHealth;
        display_message(this.getName() + " has been fully healed!");
    }else if(amount > 0){
        this.__health += amount;
        display_message(this.getName() + " recovers " + amount + " health!");
        if(this.__health >= this.__maxHealth){
            this.__health = this.__maxHealth;
        }
    }
}
LivingThing.prototype.__act = function(){
    if(0 < this.__health && this.__health < this.__maxHealth){
        var amount = this.__regeneration;
        this.__health += amount;
        display_message(this.getName() + " regenerates " + amount + " health!");
        if(this.__health >= this.__maxHealth){
            this.__health = this.__maxHealth;
        }
        display_message(this.getName() + " has " + this.__health + 
                        " out of " + this.__maxHealth + " health points");
    }
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Person
//-------------------------------------------------------------------------
function Person(name, initLoc){
    const PERSON_HEALTH = 50;
    const PERSON_REGEN  = 1;
    this.__possessions  = list();
    this.__weaponCmds   = [];
    this.__extraCmds    = [];
    this.__prevLoc      = initLoc;
    this.__deployIn     = 0;
    this.__moveFlag     = true;

    LivingThing.call(this, name, initLoc, PERSON_HEALTH, PERSON_REGEN);
}
Person.Inherits(LivingThing);
Person.__actionMgrDelegate = null;
Person.__bounty = 5;
// For student use
Person.prototype.getPossessions = function(){
    return this.__possessions;
}
Person.prototype.say = function(stuff){
    if(stuff == null || stuff === ""){
        stuff = "Oh, nevermind.";
    }
    display_message("At " + this.getLocation().getName() + ": " + 
                    this.getName() + " says -- " + stuff);
}
Person.prototype.take = function(things){
    var canOwn      = [];
    var cannotOwn   = [];
    while(!is_empty_list(things)){
        var thing = head(things);
        if(thing instanceof Thing &&
           !(thing instanceof Generator) &&
           !thing.isOwned()){
            canOwn.push(thing);
        }else{
            cannotOwn.push(thing);
        }
        things = tail(things);
    }

    if(canOwn.length > 0){
        var takeMsg = "At " + this.getLocation().getName() + ": " + 
                      this.getName() + " takes: ( ";
        for(var i = 0; i < canOwn.length; i++){
            var thing = canOwn[i];
            this.__possessions = append(this.__possessions, list(thing));
            thing.__setOwner(this);
            thing.__remove(this.getLocation());
            takeMsg += thing.getName() + " ";
        }
        takeMsg += ")"
        display_message(takeMsg);
    }
    
    if(cannotOwn.length > 0){
        var cantTakeMsg = "(";
        for(var i = 0; i < cannotOwn.length; i++){
            var thing = cannotOwn[i];
            cantTakeMsg += thing.getName() + " ";
        }
        cantTakeMsg += " ) cannot be taken";
        display_message(cantTakeMsg);
    }
}
Person.prototype.drop = function(things){
    var owned       = [];
    var notOwned    = [];
    while(!is_empty_list(things)){
        var thing = head(things);
        if(thing instanceof Thing &&
           thing.getOwner() === this){
            owned.push(thing);
        }else{
            notOwned.push(thing);
        }
        things = tail(things);
    }

    if(owned.length > 0){
        var dropMsg = "At " + this.getLocation().getName() + ": " +
                      this.getName() + " drops: ( ";
        for(var i = 0; i < owned.length; i++){
            var thing = owned[i];
            this.__possessions = remove(thing, this.__possessions);
            thing.__setOwner(null);
            thing.__install(this.getLocation());
            dropMsg += thing.getName() + " ";
        }
        dropMsg += ")"
        display_message(dropMsg);
    }
    
    if(notOwned.length > 0){
        var cantDropMsg = "(";
        for(var i = 0; i < notOwned.length; i++){
            var thing = notOwned[i];
            cantDropMsg += thing.getName() + " ";
        }
        cantDropMsg += " ) cannot be dropped";
        display_message(cantDropMsg);
    }
}
Person.prototype.moveTo = function(newLoc){
    if(!this.__moveFlag){
        return false;
    }
    this.__moveFlag = false;
    
    var currLoc     = this.getLocation();
    if(currLoc === newLoc){
        display_message(this.getName() + " is already at " + 
                currLoc.getName());
        return false;
    }
    if(currLoc.__isConnected(newLoc) && 
       newLoc.allowEntry(this)){
        var fromPos = currLoc.__getOccupantPos(this);
        var fromLoc = currLoc;

        this.__prevLoc = currLoc;
        this.__remove(this.__prevLoc);
        this.__install(newLoc);

        var toPos   = newLoc.__getOccupantPos(this);
        var toLoc   = newLoc;

        var newAction = new Action(fromLoc, toLoc, fromPos, toPos, 
                                   MOVE_LIFETIME, MOVE_COL, MOVE_STYLE, MOVE_THICKNESS);
        Person.__actionMgrDelegate.__registerAction(newAction);

        display_message(this.getName() + " moves from " + 
                        currLoc.getName() + " to " + newLoc.getName());
        return true;
    }else{
        display_message(this.getName() + " can't move from " + 
                        currLoc.getName() + " to " + newLoc.getName());
        return false;
    }
}
Person.prototype.getPrevLoc = function(){
    return this.__prevLoc;
}
Person.prototype.go = function(direction){
    var currLoc = this.getLocation();
    var newLoc  = currLoc.getExit(direction);
    if(newLoc == false){
        display_message(this.getName() + " cannot go " + 
                        direction + " from " + currLoc.getName());
        return;
    }
    this.moveTo(newLoc);
}
Person.prototype.use = function(thing, args){
    if(thing instanceof Thing)
    {
        if(!(thing.__use instanceof Function)){
            display_message(this.getName() + " does not do anything!");
        }else if(thing.getOwner() != this){
            display_message(this.getName() + " does not own " + thing.getName() + "!");
        }else{
            thing.__use(args);
        }
    }
}
// End of methods for student use
Person.prototype.__act = function(){
    LivingThing.prototype.__act.call(this);
    this.__moveFlag = true;
    
    var possessions = this.getPossessions();
    while(!is_empty_list(possessions)){
        var possession = head(possessions);
        if(possession instanceof Weapon){
            possession.__act();
        }
        possessions = tail(possessions);
    }
}
Person.prototype.__recover = function(){
    if(this.__deployIn > 0){
        this.__deployIn--;
    }
    var possessions = this.getPossessions();
    while(!is_empty_list(possessions)){
        var possession = head(possessions);
        if(possession instanceof Weapon){
            possession.__act();
        }
        possessions = tail(possessions);
    }
}
Person.prototype.__readyToDeploy = function(){
    return (this.__deployIn == 0);
}
Person.prototype.__deploy = function(newLoc){
    var currLoc     = this.getLocation();
    if(this.__readyToDeploy() &&
       currLoc instanceof Ship && 
       newLoc.allowEntry(this))
    {
        this.__deadFlag    = false;
        this.__heal(Number.MAX_VALUE);
        this.__remove(currLoc);
        this.__prevLoc = currLoc;
        this.__install(newLoc);
        this.say("Entering enemy territory...");
        display_message(this.getName() + " moves from " + 
                        currLoc.getName() + " to " + newLoc.getName());
    }
}
Person.prototype.__evacuate = function(evacSite){    
    if(evacSite != null){
        this.say("I need help here!");
    }
    var toDrop = list();
    var possessions = this.getPossessions();
    var toDrop = filter(function (item) {return !(item instanceof Weapon);}, possessions);
    this.drop(toDrop);
    this.__prevLoc = this.getLocation();
    this.__remove(this.__prevLoc);
    if(evacSite != null){
        this.__deployIn = CONF_RECOVER_TIME;
        this.__install(evacSite);
    }
}

Person.prototype.__hasKeycard = function(){
    return (!is_empty_list(filter(function (item) {return item instanceof Keycard;}, this.getPossessions())));
}

Person.prototype.__isThief = function(){
    return this.__hasKeycard();
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Player
//-------------------------------------------------------------------------
function Player(name){
    if(name != null && 
       name.length > Player.__nameLimit){
        name = name.substring(0,Player.__nameLimit);
    }
    Person.call(this, name, null);
}
Player.Inherits(Person);
Player.__evacLoc = null;
Player.__nameLimit = 4;
Player.prototype.__die = function(){
    Person.prototype.__die.call(this);
    this.__evacuate(Player.__evacLoc);
}

function RegisterPlayer(newPlayer, level, engine,
                        saberColor, laserColor, litColor, bombColor){
    engine.__registerPlayer(newPlayer);
    var playerLoc = newPlayer.getLocation();
    newPlayer.take(list(MakeAndInstallLightSaber(playerLoc, level, saberColor),
                        MakeAndInstallLightSaber(playerLoc, level, saberColor),
                        MakeAndInstallLaser(playerLoc, level, laserColor),
                        MakeAndInstallLightning(playerLoc, level, litColor),
                        MakeAndInstallLightning(playerLoc, level, litColor),
                        MakeAndInstallGenBomb(playerLoc, level, bombColor)));    
    return newPlayer;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// ServiceBot
//-------------------------------------------------------------------------
function ServiceBot(name, initLoc, inertia){
    Person.call(this, name, initLoc);
    this.__inertia = inertia;
}
ServiceBot.Inherits(Person);
ServiceBot.__bounty = 10;
ServiceBot.__actorMgrDelegate = null;
ServiceBot.prototype.__act = function(){
    Person.prototype.__act.call(this);
    if(Math.floor(Math.random()*this.__inertia) == 0){
        var randomLoc = this.__pickRandomDir();
        if(!is_empty_list(randomLoc)){
            this.moveTo(head(randomLoc));
        }
    }
}
ServiceBot.prototype.__die = function(){
    Person.prototype.__die.call(this);
    this.__evacuate();
    ServiceBot.__actorMgrDelegate.__removeActor(this);
}
ServiceBot.prototype.__pickRandomDir = function(){
    var self = this;
    var accessible = filter(function (room) {return room.allowEntry(self);}, self.getLocation().getNeighbours());
    if(accessible.length > 0){
        return list(list_ref(accessible, random(length(accessible))));
    }
    return list();
}
ServiceBot.prototype.__evacuate = function(evacSite){
    this.say("ENERGY LEVELS CRITICAL. SHUTTING DOWN.");
    Person.prototype.__evacuate.call(this);
    if(CONF_DRONE_BOT){
        var newDrone = MakeAndInstallDrone(this.__prevLoc);
    }
}

function MakeAndInstallBot(name, initLoc, inertia){
    var newBot = new ServiceBot(name, initLoc, inertia);
    newBot.__install(newBot.getLocation());
    newBot.take(list(MakeAndInstallKeycard(newBot.getLocation())));
    ServiceBot.__actorMgrDelegate.__registerActor(newBot);
    return newBot;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// SecurityDrone
//-------------------------------------------------------------------------
function SecurityDrone(initLoc){
    this.__visited = [];
    this.__spawnCycle = CONF_ALARM_CYCLE;
    this.__initLoc = initLoc;
    Person.call(this, "d-" + SecurityDrone.__droneCount.toString(16), initLoc);
    SecurityDrone.__droneCount++;
}
SecurityDrone.Inherits(Person);
SecurityDrone.__droneCount = 0;
SecurityDrone.__actorMgrDelegate = null;
SecurityDrone.prototype.__spawn = function(threshold){
    if(Math.floor(Math.random()*threshold) == 0){
        var newDrone = MakeAndInstallDrone(this.__initLoc);
    }
}
SecurityDrone.prototype.__act = function(){
    Person.prototype.__act.call(this);
    
    var self = this;
    var myLocation = self.getLocation();
    
    this.__spawnCycle--;
    if(this.__spawnCycle == 0){
        this.__spawnCycle = CONF_ALARM_CYCLE;
        if(this.__initLoc.spaceLeft() > 0){
            this.__spawn(length(this.__initLoc.getOccupants()));
        }
    }

    var thieves = filter(function(person) {return person instanceof Player && person.__isThief();}, self.getLocation().getOccupants());
    for_each(function (thief) {
        var readyWeapons = filter(function(item) {return item instanceof Weapon && !item.isCharging();}, self.getPossessions());
        if (!is_empty_list(readyWeapons)) {
            self.use(head(readyWeapons), list(thief));
        }
    }, thieves);
    
    var litter = myLocation.getThings();
    var keycards = filter(function (item) {return item instanceof Keycard;}, litter);

    if(length(keycards) > 0){
        this.take(keycards);
    }
    
    var adjacent = myLocation.getNeighbours();
    var adjNew = filter(function(loc) {return !self.__hasVisited(loc) && loc.allowEntry(self);}, adjacent);
    var randomDest = null;
    if(adjNew.length > 0){
        randomDest = list_ref(adjNew, random(length(adjNew)));
    }else{
        randomDest = list_ref(adjacent, random(length(adjacent)));
    }
    this.moveTo(randomDest);
}
SecurityDrone.prototype.__die = function(){
    Person.prototype.__die.call(this);
    this.__evacuate();
    SecurityDrone.__actorMgrDelegate.__removeActor(this);
}
SecurityDrone.prototype.__hasVisited = function(location){
    return (this.__visited.indexOf(location) != -1);
}
SecurityDrone.prototype.moveTo = function(newLoc){
    var success = Person.prototype.moveTo.call(this, newLoc);
    if(success && !this.__hasVisited(this.getLocation())){
        this.__visited.push(this.getLocation());
    }
    return success;
}
SecurityDrone.prototype.__evacuate = function(evacSite){
    this.say("ENERGY LEVELS CRITICAL. SHUTTING DOWN.");
    Person.prototype.__evacuate.call(this);
}

function MakeAndInstallDrone(initLoc){
    var activeDrones = SecurityDrone.__actorMgrDelegate.__getType(SecurityDrone);
    if(activeDrones.length > CONF_MAX_DRONES){
        return null;
    }
    var newDrone = new SecurityDrone(initLoc);
    newDrone.__install(newDrone.getLocation());
    newDrone.take(list(MakeAndInstallZapRay(newDrone.getLocation()),
                       MakeAndInstallKeycard(newDrone.getLocation())));
    SecurityDrone.__actorMgrDelegate.__registerActor(newDrone);
    return newDrone;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Thing
//-------------------------------------------------------------------------
function Thing(name, initLoc){
    this.__owner     = null;
    MobileObject.call(this, name, initLoc);
}
Thing.Inherits(MobileObject);
// For student use
Thing.prototype.getLocation = function(){
    if(this.isOwned()){
        return this.__owner.getLocation();
    }else{
        return MobileObject.prototype.getLocation.call(this);
    }
}
Thing.prototype.isOwned = function(){
    if(this.__owner == null){
        return false;
    }
    return true;
}
Thing.prototype.getOwner = function(){
    return this.__owner;
}
// End of methods for student use
Thing.prototype.__setOwner = function(newOwner){
    this.__owner = newOwner;
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Weapon
//-------------------------------------------------------------------------
function Weapon(name, initLoc, cooldown, 
                atkColor, atkWidth, atkStyle, 
                minDmg, maxDmg, targetCheck, maxTarg, maxRange){
    this.__chargeCycle  = 0;
    this.__cooldown     = cooldown;
    this.__maxTarg      = maxTarg;
    this.__atkColor     = atkColor;
    this.__atkWidth     = atkWidth;
    this.__atkStyle     = atkStyle;
    this.__minDmg       = minDmg;
    this.__maxDmg       = maxDmg;
    this.__targetCheck  = targetCheck;
    this.__range        = maxRange;
    Thing.call(this, name, initLoc);
}
Weapon.Inherits(Thing);
Weapon.__actionMgrDelegate = null;
Weapon.__statsMgrDelegate = null;
// For student use
Weapon.prototype.isCharging = function(){
    return (this.__chargeCycle > 0);
}
Weapon.prototype.chargeCyclesLeft = function(){
    return this.__chargeCycle;
}
Weapon.prototype.getMinDmg = function(){
    return this.__minDmg;
}
Weapon.prototype.getMaxDmg = function(){
    return this.__maxDmg;
}
Weapon.prototype.getRange = function(){
    return this.__range;
}
// End of methods for student use
Weapon.prototype.__use = function(targets){
    var attacker = this.getOwner();

    if(this.isCharging()){
        display_message(attacker.getName() + " cannot use " + 
                this.getName() + " as it is still charging...");
        return;
    }

    var validTargets = [];
    var atkMsg = attacker.getName() + " uses " + this.getName() + 
            " to attack: ";
    while(!is_empty_list(targets)){
        var target = head(targets);
        if(this.__targetCheck(target) && target.getHealth() > 0 && validTargets.indexOf(target) == -1){
            validTargets.push(target);
            atkMsg += target.getName() + " ";
        }
        if(validTargets.length == this.__maxTarg){
            break;
        }
        targets = tail(targets);
    }

    if(validTargets.length > 0){
        display_message(atkMsg);
        for(var i = 0; i < validTargets.length; i++){
            var victim = validTargets[i];

            var fromPos     = attacker.getLocation().__getOccupantPos(attacker);
            var fromLoc     = attacker.getLocation();

            var toPos       = victim.getLocation().__getOccupantPos(victim);
            var toLoc       = victim.getLocation();

            var newAction = new Action(fromLoc, toLoc, fromPos, toPos, 
                                       ATK_LIFETIME, this.__atkColor, 
                                       this.__atkStyle, this.__atkWidth);
            Weapon.__actionMgrDelegate.__registerAction(newAction);

            victim.__suffer(this.__getRandomDmg());

            if(victim.__isDead()){
                if(attacker instanceof Player){
                    var points = 0;
                    if(victim instanceof ServiceBot){
                        points = ServiceBot.__bounty;
                    }else {
                        points = Person.__bounty;
                    }
                    Weapon.__statsMgrDelegate.__registerKill(attacker.getName(), points);
                }
                if(victim instanceof Player){
                    Weapon.__statsMgrDelegate.__registerDeath(victim.getName());
                }
            }
        }
        this.__chargeCycle = this.__cooldown;
        if (Weapon.__atkReview instanceof Function) {
            Weapon.__atkReview(attacker, validTargets, this);
        }
    }
}
Weapon.prototype.__getRandomDmg = function(){
    return (this.__minDmg + Math.round(Math.random()*(this.__maxDmg - this.__minDmg)));
}

Weapon.prototype.__rangeCheck = function(target){
    var wpnLoc = this.getLocation();
    var wpnRange = this.__range;
    var targetLoc = target.getLocation();

    var sameRoom = (wpnLoc === targetLoc);
    var inRange = sameRoom || !is_empty_list(filter(function (dir) {
            function helper(curRoom, range) {
                return curRoom && !(curRoom instanceof ProtectedRoom) && (range < 0 ? false : curRoom === targetLoc || helper(curRoom.getExit(dir), range - 1));
            }
            return helper(wpnLoc.getExit(dir), wpnRange - 1);
        }, wpnLoc.getExits()));

    if(!inRange){
        display_message(target.getName() + " is not within weapon range.");
    }
    return inRange;
}
Weapon.prototype.__act = function(){
    if(this.isCharging()){
        this.__chargeCycle--;
        if(this.isCharging()){
            display_message("Charging " + this.getName() + ": " +
                            this.chargeCyclesLeft() + " charge cycles remaining " +
                            "until weapon can be used...");
        }
    }
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Melee Weapon
//-------------------------------------------------------------------------
function MeleeWeapon(name, initLoc, cooldown, 
                     atkColor, atkWidth, atkStyle, 
                     minDmg, maxDmg, targetCheck){

    const MELEE_TARGETS = 1;
    const MELEE_RANGE   = 0;
    var wpn = this;
    
    Weapon.call(this, name, initLoc, cooldown, 
                  atkColor, atkWidth, atkStyle, 
                  minDmg, maxDmg, 
                  function(target){ return targetCheck(target) && wpn.__rangeCheck(target); }, 
                  MELEE_TARGETS, MELEE_RANGE);
}
MeleeWeapon.Inherits(Weapon);
MeleeWeapon.prototype.__rangeCheck = function(target){
    inRange = (this.getLocation() === target.getLocation());
    if(!inRange){
        display_message(target.getName() + " is not within weapon range.");
    }
    return inRange;
}
// For student use
MeleeWeapon.prototype.swing = function(target){
    this.__use(list(target));
}
// End of methods for student use
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Ranged Weapon
//-------------------------------------------------------------------------
function RangedWeapon(name, initLoc, range, cooldown, 
                      atkColor, atkWidth, atkStyle, 
                      minDmg, maxDmg, targetCheck){

    const RANGE_TARGETS = 1;
    var wpn = this;

    Weapon.call(this, name, initLoc, cooldown, 
                  atkColor, atkWidth, atkStyle, 
                  minDmg, maxDmg,
                  function(target){ return targetCheck(target) && wpn.__rangeCheck(target); },
                  RANGE_TARGETS, range);
}
RangedWeapon.Inherits(Weapon);
// For student use
RangedWeapon.prototype.shoot = function(target){
    this.__use(list(target));
}
// End of methods for student use
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Spell Weapon
//-------------------------------------------------------------------------
function SpellWeapon(name, initLoc, range, cooldown, 
                     atkColor, atkWidth, atkStyle, 
                     minDmg, maxDmg, targetCheck){

    const SPELL_TARGETS = Number.MAX_VALUE;
    var wpn = this;

    Weapon.call(this, name, initLoc, cooldown, 
                  atkColor, atkWidth, atkStyle, 
                  minDmg, maxDmg,
                  function(target){ return targetCheck(target) && wpn.__rangeCheck(target); }, 
                  SPELL_TARGETS, range);
}
SpellWeapon.Inherits(Weapon);
SpellWeapon.prototype.__use = function(direction){
    this.cast(direction);
}
// For student use
SpellWeapon.prototype.cast = function(direction){
    var targets = list();
    var rngLeft = this.__range + 1;
    var roomInRange = this.getOwner().getLocation();
    while(rngLeft > 0){
        targets = append(targets, roomInRange.getOccupants());
        rngLeft--;
        roomInRange = roomInRange.getExit(direction);
        if(roomInRange === false ||
           roomInRange instanceof ProtectedRoom)
        {
            break;
        }
    }
    if(length(targets) == 0){
        display_message("Nothing is within range of " + this.getName() + ".");
        return;
    }
    Weapon.prototype.__use.call(this, targets);
}
// End of methods for student use
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Bomb
//-------------------------------------------------------------------------
function Bomb(name, initLoc, range, countdown,
              atkColor, atkWidth, atkStyle, 
              minDmg, maxDmg, targetCheck){

    const BOMB_TARGETS  = Number.MAX_VALUE;
    this.__bombLoc      = null;
    this.__state        = Bomb.STATE_ACTIVE;
    var wpn = this;

    Weapon.call(this, name, initLoc, countdown, 
                  atkColor, atkWidth, atkStyle, 
                  minDmg, maxDmg, 
                  function(target){ return targetCheck(target) && wpn.__rangeCheck(target); }, 
                  BOMB_TARGETS, range);
}
Bomb.Inherits(Weapon);
Bomb.__actionMgrDelegate = null;
Bomb.__statsMgrDelegate = null;
Bomb.STATE_ACTIVE   = 0;
Bomb.STATE_ARMED    = 1;
Bomb.STATE_DEPLETED = 2;
Bomb.prototype.__use = function(){
    this.arm();
}
// For student use
Bomb.prototype.getLocation = function(){
    if(!this.canBeUsed()){
        return this.__bombLoc;
    }else{
        return Thing.prototype.getLocation.call(this);
    }
}
Bomb.prototype.getCountdown = function(){
    return this.__cooldown;
}
Bomb.prototype.arm = function(){
    if(!this.canBeUsed()){
        display_message(this.getName() + " has already been armed.");
        return;
    }

    this.__chargeCycle  = this.__cooldown;
    this.__bombLoc      = this.getOwner().getLocation();
    this.__state        = Bomb.STATE_ARMED;
}
Bomb.prototype.canBeUsed = function(){
    return (this.__state == Bomb.STATE_ACTIVE);
}
// End of methods for student use
Bomb.prototype.__detonate = function(){
    var directions = this.getLocation().getExits();
    var targets = this.__bombLoc.getOccupants();
    this.__state = Bomb.STATE_DEPLETED;

    var newAction = new Action(this.__bombLoc, this.__bombLoc, ROOM_POS, ROOM_POS, 
                               ATK_LIFETIME, this.__atkColor, 
                               this.__atkStyle, this.__atkWidth*2);
    Bomb.__actionMgrDelegate.__registerAction(newAction);
    
    while (!is_empty_list(directions)) {
        var direction = head(directions);
        directions = tail(directions);
        var rngLeft = this.__range;
        var roomInRange = this.__bombLoc.getExit(direction);
        while(rngLeft > 0){
            if(roomInRange == false ||
               roomInRange instanceof ProtectedRoom)
            {
                break;
            }
            targets = append(targets, roomInRange.getOccupants());
            newAction = new Action(roomInRange, roomInRange, ROOM_POS, ROOM_POS, 
                                   ATK_LIFETIME, this.__atkColor, 
                                   this.__atkStyle, this.__atkWidth*2);
            Bomb.__actionMgrDelegate.__registerAction(newAction);
            rngLeft--;
            roomInRange = roomInRange.getExit(direction);
        }
    }

    Weapon.prototype.__use.call(this, targets);
    
    var things = this.__bombLoc.getThings();
    for(var i = 0; i < things.length; i++){
        if(things[i] instanceof Generator){
            things[i].__destroy();
            Bomb.__statsMgrDelegate.__registerWin(this.getOwner().getName());
            break;
        }
    }
}
Bomb.prototype.__act = function(){
    if(this.__state != Bomb.STATE_ARMED){
        return;
    }

    if(this.__chargeCycle > 0){
        display_message("WARNING!  " + this.getName() +
            " will detonate at " + this.__bombLoc.getName() +
            " in " + this.chargeCyclesLeft()) + "...";

        this.__chargeCycle--;
        return;
    }

    this.__detonate();
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
// Weapon Factories
//-------------------------------------------------------------------------
function MakeAndInstallZapRay(initLoc){
    const ZAPRAY_NAME   = "zapray";
    const ZAPRAY_CD     = 1;
    const ZAPRAY_COLOR  = COL_GOLD;
    const ZAPRAY_WIDTH  = 4;
    const ZAPRAY_STYLE  = STYLE_LINE;
    const ZAPRAY_MINDMG = 11;
    const ZAPRAY_MAXDMG = 30;

    var thiefCheck = function(target){
                         return target.__isThief();
                     }

    var newWpn = new MeleeWeapon(ZAPRAY_NAME, initLoc, ZAPRAY_CD, 
                                 ZAPRAY_COLOR, ZAPRAY_WIDTH, ZAPRAY_STYLE, 
                                 ZAPRAY_MINDMG, ZAPRAY_MAXDMG, thiefCheck);
    newWpn.__install(newWpn.getLocation());
    return newWpn;
}

function MakeAndInstallLightSaber(initLoc, lvl, saberColor){
    const LSABER_NAME   = "lightsaber";
    const LSABER_CD     = 1;
    const LSABER_WIDTH  = 4;
    const LSABER_STYLE  = STYLE_LINE;

    const LSABER_MINDMG = Math.floor(1/2 + 3/2*lvl);
    const LSABER_MAXDMG = Math.floor(1/2 + 9/5*lvl);
    
    var targetCheck = function(target){
                          if(target instanceof Person){
                              return true;
                          }
                          return false;  
                      }

    var newWpn = new MeleeWeapon(LSABER_NAME, initLoc, LSABER_CD, 
                                 saberColor, LSABER_WIDTH, LSABER_STYLE, 
                                 LSABER_MINDMG, LSABER_MAXDMG, targetCheck);
    newWpn.__install(newWpn.getLocation());
    return newWpn;
}

function MakeAndInstallLaser(initLoc, lvl, laserColor){
    const LASER_NAME    = "laser";
    const LASER_RANGE   = 3;
    const LASER_CD      = 4;
    const LASER_WIDTH   = 2;
    const LASER_STYLE   = STYLE_LINE;

    const LASER_MINDMG  = Math.floor(3/4*lvl);
    const LASER_MAXDMG  = Math.floor(3/2*lvl);
    
    var targetCheck = function(target){
                          if(target instanceof Person){
                              return true;
                          }
                          return false;  
                      }

    var newWpn = new RangedWeapon(LASER_NAME, initLoc, LASER_RANGE, LASER_CD,
                                  laserColor, LASER_WIDTH, LASER_STYLE, 
                                  LASER_MINDMG, LASER_MAXDMG, targetCheck);
    newWpn.__install(newWpn.getLocation());
    return newWpn;
}

function MakeAndInstallLightning(initLoc, lvl, litColor){
    const LIGHT_NAME    = "lightning";
    const LIGHT_RANGE   = 2;
    const LIGHT_CD      = 1;
    const LIGHT_WIDTH   = 2;
    const LIGHT_STYLE   = STYLE_LINE;

    const LIGHT_MINDMG  = Math.floor(lvl/4);
    const LIGHT_MAXDMG  = Math.floor(lvl/2);
    
    var targetCheck = function(target){
                          if(target instanceof ServiceBot ||
                             target instanceof SecurityDrone ){
                              return true;
                          }
                          return false;  
                      }

    var newWpn = new SpellWeapon(LIGHT_NAME, initLoc, LIGHT_RANGE, LIGHT_CD,
                                 litColor, LIGHT_WIDTH, LIGHT_STYLE, 
                                 LIGHT_MINDMG, LIGHT_MAXDMG, targetCheck);
    newWpn.__install(newWpn.getLocation());
    return newWpn;
}

function MakeAndInstallGenBomb(initLoc, lvl, bombColor){
    const GENBOMB_NAME      = "gen-bomb";
    const GENBOMB_RANGE     = 1;
    const GENBOMB_CD        = 3;
    const GENBOMB_WIDTH     = 20;
    const GENBOMB_STYLE     = STYLE_CIRCLE;

    const GENBOMB_MINDMG    = 1;
    const GENBOMB_MAXDMG    = Math.floor(lvl/2);
    
    var targetCheck = function(target){
                          if(target instanceof Person){
                              return true;
                          }
                          return false;  
                      }

    var newWpn = new Bomb(GENBOMB_NAME, initLoc, GENBOMB_RANGE, GENBOMB_CD,
                          bombColor, GENBOMB_WIDTH, GENBOMB_STYLE, 
                          GENBOMB_MINDMG, GENBOMB_MAXDMG, targetCheck);
    newWpn.__install(newWpn.getLocation());
    return newWpn;
}
//------------------------------------------------------------------------- 

//-------------------------------------------------------------------------
// Keycard
//-------------------------------------------------------------------------
function Keycard(initLoc){
    const KEYCARD_NAME = "keycard";
    Thing.call(this, KEYCARD_NAME, initLoc);
}
Keycard.Inherits(Thing);
Keycard.__alarmSounded = false;
Keycard.__actorMgrDelegate = null;
Keycard.prototype.__setOwner = function(newOwner){
    if( CONF_DRONE_CARD && 
        Room.__genRoom != null &&
        newOwner != null &&
        !(newOwner instanceof ServiceBot) &&
        !(newOwner instanceof SecurityDrone) &&
        !this.____alarmSounded &&
        Room.__genRoom.spaceLeft() > 0)
    {
        var newDrone = MakeAndInstallDrone(Room.__genRoom);;
        this.__alarmSounded = true;
    }
    Thing.prototype.__setOwner.call(this, newOwner);
}

function MakeAndInstallKeycard(initLoc){
    var newCard = new Keycard(initLoc);
    newCard.__install(newCard.getLocation());
    return newCard;
}

//-------------------------------------------------------------------------
// Action
//-------------------------------------------------------------------------
function Action(fromLoc, toLoc, fromPos, toPos, 
        lifetime, color, style, thickness){
    this.__fromLoc        = fromLoc;
    this.__toLoc        = toLoc;
    this.__fromPos        = fromPos;
    this.__toPos        = toPos;
    this.__color        = color;
    this.__style        = style;
    this.__thickness    = thickness;
    this.__lifetime        = lifetime;
}
Action.prototype.__tick = function(){
    this.__lifetime--;
}
Action.prototype.__isAlive = function(){
    return (this.__lifetime > 0);
}
Action.prototype.__getFromLoc = function(){
    return this.__fromLoc;
}
Action.prototype.__getToLoc = function(){
    return this.__toLoc;
}
Action.prototype.__getFromPos = function(){
    return this.__fromPos;
}
Action.prototype.__getToPos = function(){
    return this.__toPos;
}
Action.prototype.__getColor = function(){
    return this.__color;
}
Action.prototype.__getStyle = function(){
    return this.__style;
}
Action.prototype.__getThickness = function(){
    return this.__thickness;
}
//-------------------------------------------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

LAYOUT19 = (function() {
var c = 0;
var p = 1;
var w = 2;
var n	= 4;
var d	= 8;
var g	= 16;
var s	= 32;
var b	= 64;
return [
    [ // L1
        [c,    w,      w,      w|s|b],
        [n,    n,      n,      n|s],
        [n,    n|b,    n,      n|s],
        [n,    w|n,    w|n|b,  w|n|s]
    ],

    [ // L2
        [c,    w,       c,    w|d|p],
        [n|d,  p|g,     n|b,  w|n],
        [n,    n,       w,    w],
        [n,    w,       w|n,  w|n]
    ],

    [ // L3
        [c,    w,    w,    w],
        [n,    w,    w,    w|n],
        [n|b,  w,    w,    w|n|d],
        [n,    w|n,  w|n,  w|n]
    ],

    [ // L4
        [c,    w,      w,      w|b],
        [n,    w|n,    w|n,    w|d],
        [n,    w|n,    w|n|b,  w],
        [n|s,  w|n|s,  w|n|s,  w|n|s]
    ]
];})();
function test_task1(player) {
	CONF_MAX_INERTIA = 2;
	var engine = new DeathCubeEngine(CONT_MODE, LAYOUT19);
	engine.__registerPlayer(player);
	player.take(list(MakeAndInstallLightSaber(player.getLocation(), 30, COL_RED),
									 MakeAndInstallLaser(player.getLocation(), 30, COL_BLUE),
									 MakeAndInstallLightning(player.getLocation(), 30, COL_PURPLE)));    
	engine.__addEndGame(
		new EndGame(
			function(){
				return player.getLocation() === Room.__genRoom;
			},
			function(){
				alert("Congratulations! You have entered the generator room!");
			}
		)
	);
	engine.__start();
	return engine;
}

function test_task2(player) {
	CONF_MAX_INERTIA = 2;
	var engine = new DeathCubeEngine(CONT_MODE, LAYOUT19);
	engine.__registerPlayer(player);
	player.take(list(MakeAndInstallLightSaber(player.getLocation(), 30, COL_RED),
									 MakeAndInstallLaser(player.getLocation(), 30, COL_BLUE),
									 MakeAndInstallLightning(player.getLocation(), 30, COL_PURPLE),
									 MakeAndInstallGenBomb(player.getLocation(), 30, COL_ORANGE)));    
	engine.__addEndGame(
		new EndGame(
			function(){
				var things = Room.__genRoom.getThings();
				return is_empty_list(filter(function (thing) {return thing instanceof Generator && !thing.__isDestroyed();}, things));
			},
			function(){
				alert("Congratulations! The generator has been destroyed!");
			}
		)
	);
	engine.__start();
	return engine;
}//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const LOOP_INTERVAL     = 300;
const SCALE_FACTOR      = 7;

const RM_SIZE           = 10*SCALE_FACTOR;
const OCC_SIZE          = 1*SCALE_FACTOR;
const OCC_FONT          = SCALE_FACTOR + "pt Courier New";

const INITOFFSETX       = RM_SIZE / 2;
const INITOFFSETY       = RM_SIZE / 2;

const MAIN_LABEL        = "Deathcube";
const MAIN_WIDTH        = RM_SIZE * 10;
const MAIN_HEIGHT       = RM_SIZE * 10;

const CAP_WALL          = "round"
const CAP_ACTION        = "round";

const CONTROLS_LABEL    = "Controls";
const CONTROLS_WIDTH    = 300;
const CONTROLS_HEIGHT   = 12*SCALE_FACTOR;    // doesn't work, windows have a min height of 100px

const SBOARD_LABEL      = "Scoreboard";
const SBOARD_WIDTH      = 300;
const SBOARD_HEIGHT     = MAIN_HEIGHT - CONTROLS_HEIGHT;

const MAIN_BG           = "#DCC8FF";         // 220 200 255

const REG_WIDTH         = 1;
const WALL_WIDTH        = 4;
const FIELD_WIDTH       = 4;
const ARROW_LENGTH      = 1*SCALE_FACTOR;

const CONT_MODE         = 0;
const STEP_MODE         = 1;

const STATE_RUN         = 0;
const STATE_END         = 1;
const STATE_EXIT        = 2;

const WIN_POINTS        = 100;

var ROOM_OCC_OFFSETS    = [{x: SCALE_FACTOR * 5,   y: SCALE_FACTOR * 1},
                           {x: SCALE_FACTOR * 2.5, y: SCALE_FACTOR * 4},
                           {x: SCALE_FACTOR * 7.5, y: SCALE_FACTOR * 4},
                           {x: SCALE_FACTOR * 2.5, y: SCALE_FACTOR * 7},
                           {x: SCALE_FACTOR * 7.5, y: SCALE_FACTOR * 7}];

var ARROW_UP_OFFSET     =  {x: SCALE_FACTOR * 85/10, y: SCALE_FACTOR * 5/10};
var ARROW_DOWN_OFFSET   =  {x: SCALE_FACTOR * 5/10,  y: SCALE_FACTOR * 85/10};

function getRoomX(x, z){
    return INITOFFSETX + Math.floor(z / 2)*RM_SIZE*5 + x*RM_SIZE;
}

function getRoomY(y, z){
    return INITOFFSETY + (z % 2)*RM_SIZE*5 + y*RM_SIZE;
}

//-------------------------------------------------------------------------
function EndGame(condition, result){
    this.__condition    = condition;
    this.__result       = result;
}
//-------------------------------------------------------------------------
function Stats(name, cons){
    this.__name         = name;
    this.__cons         = cons;
    this.__points       = 0;
    this.__evacs        = 0;
    this.__kills        = 0;
    this.__wins         = 0;
    this.__isTraitor    = false;
}
//-------------------------------------------------------------------------
function StatsManager(){
    this.__statsHash    = {};
    this.__statsList    = [];
    this.__scoreBoard   = null;
}
StatsManager.__compareStats = function(a, b){
    if(a.__points > b.__points){
        return -1;
    }else if(a.__points < b.__points){
        return 1;
    }

    if(a.__wins > b.__wins){
        return -1;
    }else if(a.__wins < b.__wins){
        return 1;
    }

    if(a.__kills > b.__kills){
        return -1;
    }else if(a.__kills < b.__kills){
        return 1;
    }

    if(a.__evacs < b.__evacs){
        return -1;
    }else if(a.__evacs > b.__evacs){
        return 1;
    }

    return 0;
}
StatsManager.prototype.__registerNew = function(playerName, playerCons){
    this.__statsHash[playerName] = new Stats(playerName, playerCons);
    this.__statsList.push(this.__statsHash[playerName]);
    this.__updateScoreBoard();
}
StatsManager.prototype.__registerKill = function(playerName, score){
    this.__statsHash[playerName].__kills += 1;
    this.__statsHash[playerName].__points += score;
    this.__updateScoreBoard();
}
StatsManager.prototype.__registerDeath = function(playerName){
    this.__statsHash[playerName].__evacs += 1;
    this.__updateScoreBoard();
}
StatsManager.prototype.__registerWin = function(playerName){
    this.__statsHash[playerName].__wins += 1;
    this.__statsHash[playerName].__points += WIN_POINTS;
    this.__updateScoreBoard();
}
StatsManager.prototype.__registerTraitor = function(playerName){
    this.__statsHash[playerName].__isTraitor = true;
    this.__updateScoreBoard();
}
StatsManager.prototype.__getStats = function(playerName){
    if(this.__statsHash[playerName] != null){
        return this.__statsHash[playerName];
    }
    return null;
}
StatsManager.prototype.__getRank = function(playerName){
    var stats = this.__statsHash[playerName];
    if(stats == null){
        return Number.MAX_VALUE;
    }
    return (this.__statsList.indexOf(stats) + 1);
}
StatsManager.prototype.__sortStats = function(){
    this.__statsList.sort(StatsManager.__compareStats);
}
StatsManager.prototype.__getWinners = function(optimalNum){
    this.__sortStats();
    var winners = [];

    var idx = 0;
    while(this.__statsList.length > idx &&
          optimalNum > idx){
        winners.push(this.__statsList[idx].__cons.name);
        idx++;
    }
    while(this.__statsList.length > idx &&
          StatsManager.__compareStats(this.__statsList[optimalNum-1],
                                      this.__statsList[idx]) == 0){
        winners.push(this.__statsList[idx].__cons.name);
        idx++;
    }

    return winners;
}
StatsManager.prototype.__setScoreBoard = function(scoreBoard){
    this.__scoreBoard = scoreBoard;
}
StatsManager.prototype.__updateScoreBoard = function(){
    if(this.__scoreBoard == null){
        return;
    }
    this.__sortStats();
    ui_clear(this.__scoreBoard);
    for(var i = 0; i < this.__statsList.length; i++){
        var scoreTxt = this.__statsList[i].__name + " ";
        if(this.__statsList[i].__isTraitor){
            scoreTxt += "[TRAITOR]<br>";
        }else{
            scoreTxt += "<br>";
        }
        scoreTxt +=     " Points: " + this.__statsList[i].__points  + " " +
                        " Wins: " + this.__statsList[i].__wins  + " " +
                        " Kills: " + this.__statsList[i].__kills  + " " +
                        " Evacs: " + this.__statsList[i].__evacs + " ";

        ui_write(this.__scoreBoard, scoreTxt);
    }
}
//-------------------------------------------------------------------------
function ActionManager(){
    this.__actions    = [];
}
ActionManager.prototype.__registerAction = function(newAction){
    if(newAction instanceof Action){
        this.__actions.push(newAction);
    }
}
ActionManager.prototype.__drawActions = function(viewport){
    for(var i = 0; i < this.__actions.length; i++){
        var action      = this.__actions[i];

        var fromX       = action.__getFromLoc().__getX();
        var fromY       = action.__getFromLoc().__getY();
        var fromZ       = action.__getFromLoc().__getZ();
        var fromPos     = action.__getFromPos();

        var fromDrawX   = getRoomX(fromX, fromZ);
        var fromDrawY   = getRoomY(fromY, fromZ);

        if(fromPos != ROOM_POS){
            fromDrawX += ROOM_OCC_OFFSETS[fromPos].x;
            fromDrawY += ROOM_OCC_OFFSETS[fromPos].y;
        }else{
            fromDrawX += RM_SIZE / 2;
            fromDrawY += RM_SIZE / 2;
        }

        var toX     = action.__getToLoc().__getX();
        var toY     = action.__getToLoc().__getY();
        var toZ     = action.__getToLoc().__getZ();
        var toPos   = action.__getToPos();

        var toDrawX = getRoomX(toX, toZ);
        var toDrawY = getRoomY(toY, toZ);

        if(toPos != ROOM_POS){
            toDrawX += ROOM_OCC_OFFSETS[toPos].x;
            toDrawY += ROOM_OCC_OFFSETS[toPos].y;
        }else{
            toDrawX += RM_SIZE / 2;
            toDrawY += RM_SIZE / 2;
        }

        if(action.__getStyle() == STYLE_LINE){
            draw_line(viewport,
                      fromDrawX, fromDrawY,
                      toDrawX, toDrawY,
                      action.__getColor(), action.__getThickness(),
                      CAP_ACTION);
        }else if(action.__getStyle() == STYLE_CIRCLE){
            draw_circle(viewport,
                        toDrawX,
                        toDrawY,
                        action.__getThickness() / 2,
                        action.__getColor(), true);
        }
        action.__tick();
    }
    for(var i = this.__actions.length-1; i > -1 ; i--){
        if(!this.__actions[i].__isAlive()){
            this.__actions.splice(i, 1);
        }
    }
}
//-------------------------------------------------------------------------
ActorManager.__statsMgrDelegate = null;
ActorManager.__errorDelegate = null;
function ActorManager(){
    this.__actors     = [];
    this.__current    = 0;
}
ActorManager.prototype.__registerActor = function(newActor){
    if(newActor != null && newActor.__act != undefined){
        this.__actors.push(newActor)
    }
}
ActorManager.prototype.__removeActor = function(actor){
    var actorIdx = this.__actors.indexOf(actor);
    if(actorIdx != -1){
        this.__actors.splice(actorIdx, 1);
        if(actorIdx < this.__current){
            this.__current--;
        }
    }

}
ActorManager.prototype.__act = function(){
    if(this.__actors.length == 0){
        return false;
    }
    if(this.__current < 0){
        this.__current = 0;
    }

    if(this.__current == 0){
        display_message("---Tick---");
        this.__sort();
    }

    var currentActor = this.__actors[this.__current];
    if(!currentActor.__isDead()){
        try {
            currentActor.__act();
        } catch (err) {
            if (ActorManager.__errorDelegate) {
                ActorManager.__errorDelegate(currentActor, err);
            }
        }
    }else{
        currentActor.__recover();
    }

    this.__current = (this.__current+1) % this.__actors.length;
    if(this.__current == 0){
        return true; // 1 round has passed
    }
    return false;
}

ActorManager.prototype.__getType = function(type){
    var registered = [];
    for(var i = 0; i < this.__actors.length; i++){
        if(this.__actors[i] instanceof type){
            registered.push(this.__actors[i]);
        }
    }
    return registered;
}
// concat by type has the potential issue of overlaps; not using __getType
ActorManager.prototype.__sort = function(){
    var rankDelegate = ActorManager.__statsMgrDelegate;
    var typeRanks = [Player, SecurityDrone, ServiceBot];
    var sorted = this.__actors.sort(function(a, b){
        var a_name = a.getName();
        var b_name = b.getName();
        for (var i = 0; i < typeRanks.length; ++i) {
            var a_is_type = a instanceof typeRanks[i];
            var b_is_type = b instanceof typeRanks[i];
            if (a_is_type && b_is_type)
                break;
            else if (a_is_type)
                return -1;
            else if (b_is_type)
                return 1;
        }
        // now both have same highest-ranked type
        if (a instanceof Player) {
            if(rankDelegate.__getRank(a_name) < rankDelegate.__getRank(b_name)){
                return -1;
            }else if(rankDelegate.__getRank(a_name) > rankDelegate.__getRank(b_name)){
                return 1;
            }
            return 0;
        } else {
            return (a_name < b_name ? -1 : (a_name == b_name ? 0 : 1));
        }
    });
    this.__actors = sorted;
}
//-------------------------------------------------------------------------
function DeathCubeEngine(mode, layout){
    this.__deathcube    = [];
    this.__ship         = null;
    this.__endGame      = [];
    this.__viewport     = null;
    this.__controlWin   = null;
    this.__scoreWin     = null;
    this.__ctrlBtn      = null;
    this.__exitBtn      = null;
    this.__timer        = null;
    this.__botCount     = 0;
    this.__actorMgr     = null;
    this.__actionMgr    = null;
    this.__statsMgr     = null;
    this.__state        = STATE_RUN;
    this.__mode         = mode;
    this.__stepsLeft    = 0;
    this.__roundsLeft   = 0;
	this.__win			= null;

    this.__initMgrs = function(){
                          this.__actorMgr = new ActorManager();
                          this.__actionMgr = new ActionManager();
                          this.__statsMgr = new StatsManager();
                          ActorManager.__statsMgrDelegate = this.__statsMgr;
                          Keycard.__actorMgrDelegate = this.__actorMgr;
                          ServiceBot.__actorMgrDelegate = this.__actorMgr;
                          SecurityDrone.__actorMgrDelegate = this.__actorMgr;
                          Person.__actionMgrDelegate = this.__actionMgr;
                          Weapon.__actionMgrDelegate = this.__actionMgr;
                          Weapon.__statsMgrDelegate = this.__statsMgr;
                          Bomb.__actionMgrDelegate = this.__actionMgr;
                          Bomb.__statsMgrDelegate = this.__statsMgr;
                          ActorManager.__errorDelegate = function(actor, err) {display_message("Error from " + actor.getName() + ": " + err.message + " at " + err.fileName + ", line " + err.lineNumber);};
                      }

    var minInertia  = CONF_MIN_INERTIA;
    var maxInertia  = CONF_MAX_INERTIA;
    var inertia     = minInertia;
    this.__makeRoom = function(roomData, x, y, z){
						  var c = 0;
						  var p = 1;
						  var w = 2;
						  var n	= 4;
						  var d	= 8;
						  var g	= 16;
						  var s	= 32;
						  var b	= 64;

                          var newRoom = new (roomData&p ? ProtectedRoom : Room)("room-"+z+y+x, x, y, z);

                          if(roomData&g){
                              MakeAndInstallGenerator(newRoom);
                          }
                          if(roomData&s){
                              this.__ship.__addEntryPoint(newRoom);
                          }
                          if(roomData&b){
                              var newBot = MakeAndInstallBot("bot-"+this.__botCount, newRoom, inertia);
                              this.__actorMgr.__registerActor(newBot);
                              inertia = minInertia + ((inertia + 1 - minInertia) % (maxInertia - minInertia + 1));
                              this.__botCount++;
                          }
                          return newRoom;
                      }

    this.__connectRoom = function(roomData, x, y, z){
							 var c = 0;
							 var p = 1;
							 var w = 2;
							 var n	= 4;
							 var d	= 8;
							 var g	= 16;
							 var s	= 32;
							 var b	= 64;

                             var room = this.__deathcube[z][y][x];
                             if(roomData&w){
                                 if(x - 1 >= 0){
                                     room.__setExit("west", this.__deathcube[z][y][x-1]);
                                 }
                             }
                             if(roomData&n){
                                 if(y - 1 >= 0){
                                     room.__setExit("north", this.__deathcube[z][y-1][x]);
                                 }
                             }
                             if(roomData&d){
                                 if(z - 1 >= 0){
                                     room.__setExit("down", this.__deathcube[z-1][y][x]);
                                 }
                             }
                         }

    this.__initRooms = function(layout){
                           this.__ship = new Ship("JFDI-Ship");
                           Player.__evacLoc = this.__ship;

                           // first pass, just create and populate rooms
                           for(var z = 0; z < layout.length; z++){
                               var newLevel = [];
                               for(var y = 0; y < layout[z].length; y++){
                                   var newLine = [];
                                   for(var x = 0; x < layout[z][y].length; x++){
                                       var newRoom = this.__makeRoom(layout[z][y][x], x, y, z);
                                       newLine.push(newRoom);
                                   }
                                   newLevel.push(newLine);
                               }
                               this.__deathcube.push(newLevel);
                           }
                           // second pass, connect rooms to one another
                           for(var z = 0; z < layout.length; z++){
                               for(var y = 0; y < layout[z].length; y++){
                                   for(var x = 0; x < layout[z][y].length; x++){
                                       this.__connectRoom(layout[z][y][x], x, y, z);
                                   }
                               }
                           }
                       }

    this.__initWin = function(){
						 this.__win			= create_window();
                         this.__viewport    = create_viewport(MAIN_LABEL, 0, 0, MAIN_WIDTH, MAIN_HEIGHT, this.__win);
                         this.__controlWin  = create_panel(CONTROLS_LABEL, MAIN_WIDTH, 0,
                                                           CONTROLS_WIDTH, CONTROLS_HEIGHT,
                                                           MAIN_BG, this.__win);
                         this.__scoreWin    = create_panel(SBOARD_LABEL, MAIN_WIDTH, CONTROLS_HEIGHT,
                                                           SBOARD_WIDTH, SBOARD_HEIGHT,
                                                           COL_WHITE, this.__win);
                         this.__statsMgr.__setScoreBoard(this.__scoreWin);

                         var engine = this;
                         this.__ctrlBtn     = make_button("ctrlBtn", this.__controlWin, null);

                         switch(this.__mode){
                             case CONT_MODE:
                                 set_button_text(this.__ctrlBtn, "Suspend Mission");
                                 set_button_callback(this.__ctrlBtn, function(){ engine.__suspend(); });
                                 break;
                             case STEP_MODE:
                                 set_button_text(this.__ctrlBtn, "Next Action");
                                 set_button_callback(this.__ctrlBtn, function(){ engine.__step(1); });
                                 break;
                         }

                         this.__exitBtn     = make_button("exitBtn",
                                                          this.__controlWin,
                                                          function(){ engine.__exit(); });
                         set_button_text(this.__exitBtn, "Abort Mission");
                     }

    this.__initMgrs();
    this.__initRooms(layout);
    this.__initWin();
}
DeathCubeEngine.prototype.__step = function(num){
    this.__stepsLeft += num;
}
DeathCubeEngine.prototype.__runRounds = function(num){
    this.__roundsLeft += num;
}
DeathCubeEngine.prototype.__suspend = function(){
    this.__stop();
    var engine = this;
    set_button_text(this.__ctrlBtn, "Resume Mission");
    set_button_callback(this.__ctrlBtn, function(){ engine.__resume(); });
}
DeathCubeEngine.prototype.__resume = function(){
    this.__start();
    var engine = this;
    set_button_text(this.__ctrlBtn, "Suspend Mission");
    set_button_callback(this.__ctrlBtn, function(){ engine.__suspend(); });
}
DeathCubeEngine.prototype.__start = function(){
    var engine = this;
    if(this.__state != STATE_RUN){
        return;
    }
    this.__timer = setInterval(function(){
                                   engine.__draw();

                                   if(engine.__mode == STEP_MODE &&
                                      engine.__roundsLeft == 0 && engine.__stepsLeft == 0){
                                       return;
                                   }

                                   var roundTick = engine.__update();

                                   if(engine.__mode == STEP_MODE){
                                       if(engine.__roundsLeft > 0 && roundTick){
                                           engine.__roundsLeft--;
                                       }else if(engine.__roundsLeft == 0 &&
                                            engine.__stepsLeft > 0){
                                           engine.__stepsLeft--;
                                       }
                                   }
                               }, LOOP_INTERVAL);
}

DeathCubeEngine.prototype.__stop = function(){
    clearInterval(this.__timer);
    this.__timer = null;
}
DeathCubeEngine.prototype.__update = function(){
    this.__ship.__deploy();
    var roundTick = this.__actorMgr.__act();
    for(var i = 0; i < this.__endGame.length; i++){
        if(this.__endGame[i].__condition()){
            this.__state = STATE_END;
            this.__draw();
            this.__stop();
            this.__endGame[i].__result();
            break;
        }
    }
    return roundTick;
}
DeathCubeEngine.prototype.__draw = function(){
    clear_frame(this.__viewport, MAIN_BG);

    this.__drawRoomBG();
    var levels = this.__deathcube.length;
    for(var z = 0; z < levels; z++){
        var nsLength = this.__deathcube[z].length;
        for(var y = 0; y < nsLength; y++){
            var ewLength = this.__deathcube[z][y].length;
            for(var x = 0; x < ewLength; x++){
                var room = this.__deathcube[z][y][x];
                var roomX = getRoomX(x, z);
                var roomY = getRoomY(y, z);

                this.__drawRoom(room, x, y, roomX, roomY);
                this.__drawOccupants(room, x, y, roomX, roomY);
            }
        }
    }
    this.__actionMgr.__drawActions(this.__viewport);
}
DeathCubeEngine.prototype.__drawRoomBG = function(){
    var levels = this.__deathcube.length;
    for(var z = 0; z < levels; z++){
        var nsLength = this.__deathcube[z].length;
        for(var y = 0; y < nsLength; y++){
            var ewLength = this.__deathcube[z][y].length;
            for(var x = 0; x < ewLength; x++){
                var room = this.__deathcube[z][y][x];
                var roomX = getRoomX(x, z);
                var roomY = getRoomY(y, z);
                draw_rect(this.__viewport,
                          roomX, roomY,
                          RM_SIZE, RM_SIZE,
                          COL_WHITE, true);
            }
        }
    }
}
DeathCubeEngine.prototype.__drawRoom = function(room, x, y, roomX, roomY){
    // draw_rect(this.__viewport,
    //           roomX, roomY,
    //           RM_SIZE, RM_SIZE,
    //           COL_WHITE, true);
    // draw_rect(this.__viewport,
    //           roomX, roomY,
    //           RM_SIZE, RM_SIZE,
    //           COL_BLACK, false);

    var northBoundary   = (y === 0);
    var southBoundary   = (room.getExit("south") == false);
    var westBoundary    = (x === 0);
    var eastBoundary    = (room.getExit("east") == false);
    var pathUp          = (room.getExit("up") != false);
    var pathDown        = (room.getExit("down") != false);

    if(northBoundary){
        draw_line(this.__viewport,
                  roomX, roomY,
                  roomX + RM_SIZE,
                  roomY,
                  COL_BLACK, WALL_WIDTH,
                  CAP_WALL);
    }
    if(westBoundary){
        draw_line(this.__viewport,
                  roomX, roomY,
                  roomX,
                  roomY + RM_SIZE,
                  COL_BLACK, WALL_WIDTH,
                  CAP_WALL);
    }
    if(eastBoundary){
        draw_line(this.__viewport,
                  roomX + RM_SIZE, roomY,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_BLACK, WALL_WIDTH,
                  CAP_WALL);
    }else if(room instanceof ProtectedRoom ||
             room.getExit("east") instanceof ProtectedRoom){
        draw_line(this.__viewport,
                  roomX + RM_SIZE, roomY,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_RED, WALL_WIDTH,
                  CAP_WALL);
    }else{
        draw_line(this.__viewport,
                  roomX + RM_SIZE, roomY,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_BLACK, REG_WIDTH,
                  CAP_WALL);
    }
    if(southBoundary){
        draw_line(this.__viewport,
                  roomX, roomY + RM_SIZE,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_BLACK, WALL_WIDTH,
                  CAP_WALL);
    }else if(room instanceof ProtectedRoom ||
             room.getExit("south") instanceof ProtectedRoom){
        draw_line(this.__viewport,
                  roomX, roomY + RM_SIZE,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_RED, WALL_WIDTH,
                  CAP_WALL);
    }else{
        draw_line(this.__viewport,
                  roomX, roomY + RM_SIZE,
                  roomX + RM_SIZE,
                  roomY + RM_SIZE,
                  COL_BLACK, REG_WIDTH,
                  CAP_WALL);
    }

    if(pathUp){
        var col = COL_BLACK;
        if(room.getExit("up") instanceof ProtectedRoom){
            col = COL_RED;
        }
        draw_up_arrow(this.__viewport,
                      roomX + ARROW_UP_OFFSET.x,
                      roomY + ARROW_UP_OFFSET.y,
                      ARROW_LENGTH, col);
    }

    if(pathDown){
        var col = COL_BLACK;
        if(room.getExit("down") instanceof ProtectedRoom){
            col = COL_RED;
        }
        draw_down_arrow(this.__viewport,
                        roomX + ARROW_DOWN_OFFSET.x,
                        roomY + ARROW_DOWN_OFFSET.y,
                        ARROW_LENGTH, col);
    }
}
DeathCubeEngine.prototype.__drawOccupants = function(room, x, y, roomX, roomY){
    var occupants = room.getOccupants();
    var occCnt = length(occupants);
    for(var i = 0; i < occCnt; i++){
        var occupant = head(occupants);
        var occupantX = roomX + ROOM_OCC_OFFSETS[i].x - OCC_SIZE / 2;
        var occupantY = roomY + ROOM_OCC_OFFSETS[i].y - OCC_SIZE / 2;

        if(occupant instanceof ServiceBot||
           occupant instanceof SecurityDrone)
        {
            draw_rect(this.__viewport,
                      occupantX,
                      occupantY,
                      OCC_SIZE, OCC_SIZE,
                      COL_BLACK, false);
        }else if(occupant instanceof Player){
            draw_circle(this.__viewport,
                        occupantX + OCC_SIZE / 2,
                        occupantY + OCC_SIZE / 2,
                        OCC_SIZE / 2,
                        COL_BLACK, false);
        }

        draw_text(this.__viewport, occupant.getName(),
                  occupantX + OCC_SIZE / 2,
                  occupantY + 2*OCC_SIZE,
                  COL_BLACK, true, OCC_FONT);
        occupants = tail(occupants);
    }
}
DeathCubeEngine.prototype.__addEndGame = function(newEnd){
    this.__endGame.push(newEnd);
}
DeathCubeEngine.prototype.__registerPlayer = function(newPlayer){
    this.__actorMgr.__registerActor(newPlayer);
    this.__statsMgr.__registerNew(newPlayer.getName(), newPlayer.constructor);
    newPlayer.__install(this.__ship);
}
DeathCubeEngine.prototype.__exit = function(){
    if(this.__state == STATE_RUN){
        alert("Aborting Mission...");
        this.__state = STATE_EXIT;
        this.__stop();
    }
	Room.__genRoom = null;
	kill_window(this.__win);
}
DeathCubeEngine.prototype.__getWinners = function(optimalNum){
    return this.__statsMgr.__getWinners(optimalNum);
}
globals = [];export_symbol('test_task1', test_task1);
export_symbol('test_task2', test_task2);
export_symbol('is_instance_of', is_instance_of);
export_symbol('NamedObject', NamedObject);
export_symbol('Room', Room);
export_symbol('ProtectedRoom', ProtectedRoom);
export_symbol('Ship', Ship);
export_symbol('MobileObject', MobileObject);
export_symbol('Generator', Generator);
export_symbol('LivingThing', LivingThing);
export_symbol('Person', Person);
export_symbol('Player', Player);
export_symbol('ServiceBot', ServiceBot);
export_symbol('SecurityDrone', SecurityDrone);
export_symbol('Thing', Thing);
export_symbol('Weapon', Weapon);
export_symbol('MeleeWeapon', MeleeWeapon);
export_symbol('RangedWeapon', RangedWeapon);
export_symbol('SpellWeapon', SpellWeapon);
export_symbol('Bomb', Bomb);
export_symbol('Keycard', Keycard);
})(window);

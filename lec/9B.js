// Using semicolon, we can create an object directly without the use of 
// a constructor function for a class.
var x_axis = { x: 1, y: 0 };
var my_obj = {};

// Also, we have two ways to create and visit the fields of an object
my_obj.first;
my_obj.first = 4;
my_obj["second"];
my_obj["second"] = 6;
my_obj.third = 8;
my_obj["fourth"] = 10;

// An object is just a container of name-value pairs
// This is the same for functions (which are methods)
var x_axis = {
    x: 1, y: 0,
    length: function () {
        return Math.sqrt(this.x * this.x +
        this.y * this.y);
    }
};

x_axis.length();

function Vector2(xx, yy) {
    return {
        x: xx, y: yy,
        length: function () {
            return Math.sqrt(this.x * this.x +
            this.y * this.y);
        }
    };
}

var y_axis = Vector2(0, 1);

// In JavaScript, function is also an object
function foo(x) {
    return x + 1;
}
foo(3);
foo.myfield = 10;
foo.myfield;
foo.call(undefined, 3);

function foo(x) {
    display(this);
    return x;
}

// foo(3);

function TestClass() {
    this.a = 0;
}

TestClass.prototype.func = function (x) {
    function inner(y) {
        this.a = this.a + y;
    }
    this.a = 100;
    inner.call(this, x);
};

var test = new TestClass();
test.func(10);
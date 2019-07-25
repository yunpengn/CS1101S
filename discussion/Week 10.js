// CS1101S @ NUS AY2016-2017 Semester 1
// Discussion Group Week 10

// The Truth About Objects
var my_object = {};
my_object["a"] = 1;
my_object["b"] = 2;
my_object["my very long key"] = 2;

var my_other_object = {
    d: 1, e: "a string", f: true, my_fun: function (x) { }
};

var my_another_object = {};
my_another_object["d"] = 1;
my_another_object["e"] = "a string";
my_another_object["f"] = true;
my_another_object["my_fun"] = function (x) { };

// Question 2
var theatre_play = { title: "This is a play" };
theatre_play["number_of_spectators"] = 666;
theatre_play.venue = "University Cultural Centre";

// Question 3
var x = pair(1, my_object);
var y = { q: 4, p: theatre_play };
var z = my_object;
z.play = pair(theatre_play, theatre_play);

// The Truth About Pseudo-Classical Objects
var xx = { a: 1, b: 2 };
var yy = { c: 3, __proto__: xx };
// display(yy.a);

function f(x) {
    return x + 1;
}
f.d = 4;
// display(f.d);

// Question 1
function Vessel(d) {
    this.displacement = d;
}

Vessel.prototype.get_displacement = function () {
    return this.displacement;
};

function ContainerShip(d, c) {
    Vessel.call(this, d);
    this.containers = c;
}

ContainerShip.Inherits(Vessel);

ContainerShip.prototype.get_containers = function () {
    return this.containers;
};

var my_boat = new Vessel(20);
var my_ship = new ContainerShip(500, list("c1", "c2"));

// Question 2
ContainerShip.prototype.unload = function () {
    this.containers = [];
};

var my_other_ship = new ContainerShip(1000, list("c1", "c2", "c3"));
// display(my_ship.get_displacement());
my_other_ship.unload();

ContainerShip["prototype"]["unload2"] = function () {
    this["containers"] = [];
};

var my_other_ship2 = {
    displacement: 1000,
    containers: list("c1", "c2", "c3"),
    __proto__: {
        unload: function () {
            this["containers"] = [];
        },
        __proto__: {
            get_containers: function () {
                return this["containers"];
            }
        }
    }
};
// display(my_ship.get_displacement());
my_other_ship.unload2();

// Practice on OOP
function Person(name) {
    this.name = name;
    this.mood = "happy";
    this.introduce_self = function () {
        display("hello, my name is " + this.name +
                " and my mood is " + this.mood);
    };
}

function Student(name, exam_score) {
    Person.call(this, name);

    this.exam_score = exam_score;
    if (this.exam_score < 50) {
        this.module_grade = "C";
    } else if (this.exam_score <= 75) {
        this.module_grade = "B";
    } else {
        this.module_grade = "A";
    }

    if (this.module_grade === "C") {
        this.mood = "still happy because I can S/U this module";
    } else {
        this.mood = "happy";
    }
}

Student.Inherits(Person);

var Harambe = new Student("Harambe", 45);
// Harambe.introduce_self();

// His score is amended to 60, but his mood is not updated accordingly.
Harambe.exam_score = 60;
// Harambe.introduce_self();

// Create a new method to update one's score.
Student.prototype.update_score = function (new_score) {
    this.exam_score = new_score;
    if (this.exam_score < 50) {
        this.module_grade = "C";
    } else if (this.exam_score <= 75) {
        this.module_grade = "B";
    } else {
        this.module_grade = "A";
    }
    if (this.module_grade === "C") {
        this.mood = "still happy because I can S/U this module";
    } else {
        this.mood = "happy";
    }
};
Harambe.update_score(60);
// Harambe.introduce_self();

Student.introduce_self = function () {
    display("hello, my name is " + this.name +
            " and my mood is " + this.mood);
    display("I am also a student!");
    display("Special");
};
// Harambe.introduce_self();
// Student.introduce_self();

Student.prototype.introduce_self = function () {
    display("hello, my name is " + this.name +
            " and my mood is " + this.mood);
    display("I am also a student!");
    display("Very special");
};
// Harambe.introduce_self();
// Student.introduce_self();
// Student.prototype.introduce_self();

// Problem 1
var n = 0;
function flip() {
    n = n === 0 ? 1 : 0;
    return n;
}

flip.called = 0;
// Problem 2
function Flip() {
    this.n = 0;
}

Flip.prototype.flip = function () {
    n = n === 0 ? 1 : 0;
    return n;
};

var flipa = new Flip();
var flipb = new Flip();
// flipa.flip();
// flipb.flip();

var flip = new Flip();
var flap1 = flip.flip();
function flap2() {
    return flip.flip();
}
var flap3 = flip;
function flap4() {
    return flip;
}
// flap1;       // 1
// flap2;       // function
// flap3;       // object
// flap4;       // function 
// flap1();     // error
// flap2();     // 0
// flap3();     // error
// flap4();     // object
// flap1;       // 1
// flap3();     // error
// flap2();     // 0
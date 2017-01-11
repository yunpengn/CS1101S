// Automatic Transaction Machine System for banks
function account(balance) {
    if (balance <= 10000) {
        this.balance = balance;
        this.max = 10000;
    } else {
        alert("This account is issued by the Source Bank.\n" +
              "The maximum balance is " + 10000);
    }
}

account.prototype.get_balance = function () {
    return this.balance;
};

account.prototype.get_max = function () {
    return this.max;
};

account.prototype.withdraw = function (amount) {
    if (this.balance >= amount) {
        var x = "Withdraw is successful.\n" +
                "Balance before withdraw: " + this.balance + "\n";
        this.balance = this.balance - amount;
        alert(x + "Balance after withdraw: " + this.balance);
    } else {
        alert("Withdraw is unsuccessful.\nBalance is not enough.");
    }
};

account.prototype.deposit = function (amount) {
    if (this.balance > this.max) {
        alert("This account is issued by the Source Bank.\n" +
              "The maximum balance is " + this.get_max());
    } else {
        var x = "Deposit is successful.\n" +
                "Balance before deposit: " + this.balance + "\n";
        this.balance = this.balance + amount;
        alert(x + "Balance after deposit: " + this.balance);
    }
};

// Test
var x = new account(200);

// Space War Simulation System
function Vector2D(x_value, y_value) {
    this.x = x_value;
    this.y = y_value;
}

Vector2D.prototype.get_x = function () {
    return this.x;
};

Vector2D.prototype.get_y = function () {
    return this.y;
};

Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2D.prototype.add = function (addend) {
    this.x = this.x + addend.x;
    this.y = this.y + addend.y;
};

Vector2D.prototype.scalar_mult = function (times) {
    return new Vector2D(this.x * times, this.y * times);
};

var x_axis = new Vector2D(1, 0);
var y_axis = new Vector2D(0, 1);

function MobileObject(position, velocity) {
    // Postion input here should be an object of Vector2D.
    this.position = position;
    // Velocity input here should also be an object of Vector2D.
    this.velocity = velocity;
}

MobileObject.prototype.get_position = function () {
    return this.position;
};

MobileObject.prototype.move = function (time) {
    this.position.add(this.velocity.scalar_mult(time));
};

function Ship(position, velocity, no_torps) {
    MobileObject.call(this, position, velocity);
    this.no_torps = no_torps;
}

Ship.Inherits(MobileObject);

Ship.prototype.attack = function () {
    if (this.num_torps > 0) {
        this.num_torps = this.num_torps - 1;
    } else {
        alert("No torpedo left!");
    }
};

var enterprise = new Ship(new Vector2D(10, 10), new Vector2D(5, 0), 8);
var falcon = new Ship(new Vector2D(50, 70), new Vector2D(10, 0), 16);

function Torpedo(position, velocity) {
    MobileObject.call(this, position, velocity);
}

Torpedo.prototype.explode = function () {

};

function EnemyShip(position, velocity, no_torps) {
    Ship.call(this, position, velocity, no_torps);
}

EnemyShip.Inherits(Ship);

EnemyShip.prototype.attack = function () {
    if (this.num_torps > 0) {
        this.num_torps = this.num_torps - 1;
    } else {
        alert("No torpedo left!");
    }
};

var good_ship = new Ship(new Vector2D(10, 10), new Vector2D(5, 0), 8);
var bad_ship = new EnemyShip(new Vector2D(50, 7), new Vector2D(10, 0), 16);

// Speaker and lecture model
function Speaker() {

}

Speaker.prototype.say = function (stuff) {
    display(stuff);
};

var peter = new Speaker();
var lucy = new Speaker();

function Lecturer() {

}

Lecturer.Inherits(Speaker);

Lecturer.prototype.lecture = function (stuff) {
    Speaker.prototype.say.call(this, stuff);
    Speaker.prototype.say.call(this, "You should be taking notes.");
};

// Alternative lecture method definition
Lecturer.prototype.lecture_altr = function (stuff) {
    this.say(stuff);
    this.say("You should be taking notes.");
};

var martin = new Lecturer();
var koklim = new Lecturer();

function GoodLecturer(inspiringPhrase) {
    this.inspiringPhrase = inspiringPhrase;
}

GoodLecturer.Inherits(Lecturer);

GoodLecturer.prototype.say = function (stuff) {
    Lecturer.prototype.say.call(this, stuff + this.inspiringPhrase);
};

var good_martin = new GoodLecturer("Abstraction is still the key!");
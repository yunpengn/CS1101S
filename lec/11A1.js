///////////////////////
// evaluator1.ts
///////////////////////


function is_tagged_object(stmt, the_tag) {
    return is_object(stmt) &&
        stmt.tag === the_tag;
}


/*
*******************************************************************************
Functions to handle primitive values.
*******************************************************************************
*/
function is_self_evaluating(stmt) {
    return is_number(stmt) ||
           is_string(stmt) ||
           is_boolean(stmt);
}


/*
*******************************************************************************
Functions to handle variable expressions.
*******************************************************************************
*/
function is_variable(stmt) {
    return is_tagged_object(stmt, "variable");
}

function variable_name(stmt) {
    return stmt.name;
}


/*
*******************************************************************************
Functions to handle function applications.
*******************************************************************************
*/
function is_application(stmt) {
    return is_tagged_object(stmt, "application");
}

function operator(stmt) {
    return stmt.operator;
}

function operands(stmt) {
    return stmt.operands;
}

function no_operands(ops) {
    return is_empty_list(ops);
}

function first_operand(ops) {
    return head(ops);
}

function rest_operands(ops) {
    return tail(ops);
}


/*
*******************************************************************************
Functions to handle and apply built-in and primitive functions.
*******************************************************************************
*/
function is_primitive_function(fun) {
    return is_tagged_object(fun, "primitive");
}

function primitive_implementation(fun) {
    return fun.implementation;
}

function apply_primitive_function(fun,argument_list) {
    return apply_in_underlying_javascript(primitive_implementation(fun),
                                          argument_list);
}


/*
*******************************************************************************
The function apply takes two arguments, a function and a list of arguments
to which the function should be applied. The function apply calls
apply_primitive_function to apply primitives.
*******************************************************************************
*/
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else {
        error("Unknown function type -- apply: " + fun);
    }
}


/*
*******************************************************************************
When evaluate processes a function application, it uses list_of_values to
produce the list of arguments to which the function is to be applied. The
function list_of_values takes as an argument the operands of the
combination. It evaluates each operand and returns a list of the
corresponding values.
*******************************************************************************
*/
function list_of_values(exps) {
    if (no_operands(exps)) {
        return [];
    } else {
        return pair(evaluate(first_operand(exps)),
                    list_of_values(rest_operands(exps)));
    }
}


/*
*******************************************************************************
The function evaluate takes as arguments a statement. It classifies the 
statement and directs its evaluation. Each type of statement has a predicate 
that tests for it and an abstract means for selecting its parts.
*******************************************************************************
*/
function evaluate(stmt) {
    if (is_self_evaluating(stmt)) {
        return stmt;
    } else if (is_variable(stmt)) {
        // Get the implemetantion details of a primitive function
        var fun = lookup_primitive_fun(variable_name(stmt), primitive_functions);
        return { tag: "primitive", implementation: fun };
    } else if (is_application(stmt)) {
        return apply(
            // function is replaced by its implementation
            evaluate(operator(stmt)),
            // arguments are all evaluated before the function is applied on them
            list_of_values(operands(stmt)));
    } else {
        error("Unknown expression type -- evaluate: " + stmt);
    }
}


/*
*******************************************************************************
Specify and define the primitive functions.
*******************************************************************************
*/
var primitive_functions =
    list(
// Primitive functions
        pair("+", function(x, y) { return x + y; }),
        pair("-", function(x, y) { return x - y; }),
        pair("*", function(x, y) { return x * y; }),
        pair("/", function(x, y) { return x / y; }),
        pair("%", function(x, y) { return x % y; }),
        pair("===", function(x, y) { return x === y; }),
        pair("!==", function(x, y) { return x !== y; }),
        pair("<", function(x, y) { return x < y; }),
        pair(">", function(x, y) { return x > y; }),
        pair("<=", function(x, y) { return x <= y; }),
        pair(">=", function(x, y) { return x >= y; }),
        pair("!", function(x) { return !x; })
    );

function lookup_primitive_fun(fname, funs) {
    if (is_empty_list(funs)) {
        error("Undefined primitive function: " + fname);
    } else {
        if (fname === head(head(funs))) {
            // return the function implementation
            return tail(head(funs));
        } else {
            return lookup_primitive_fun(fname, tail(funs));
        }
    }
}


/*
*******************************************************************************
Running the Evaluator.
*******************************************************************************
*/
// Only evaluate the first statement in a statement sequence.
function evaluate_toplevel(stmt) {
    if (is_empty_list(stmt)) {
        return undefined;
    } else {
        var value = evaluate(head(stmt));
        return value;
    }
}

function parse_and_evaluate(string) {
    return evaluate_toplevel(parse(string));
}


/*
*******************************************************************************
Testing.
*******************************************************************************
*/

/* TRY THIS:
parse_and_evaluate("12 + 11 * 8;");
*/

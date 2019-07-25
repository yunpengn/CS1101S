///////////////////////
// evaluator2.ts
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
Functions to query and manipulate environments.

An environment is a sequence of frames, where each frame is a table of
bindings that associate variables with their corresponding values. We
represent an environment as a list of frames. The enclosing environment of
an environment is the tail of the list.
*******************************************************************************
*/
var the_empty_environment = [];

function is_empty_environment(env) {
    return is_empty_list(env);
}

function first_frame(env) {
    return head(env);
}

function enclosing_environment(env) {
    return tail(env);
}

function enclose_by(frame, env) {
    return pair(frame, env);
}

function make_frame(variables, values) {
    if (is_empty_list(variables) && is_empty_list(values)) {
        return {};
    } else {
        var frame = make_frame(tail(variables), tail(values));
        frame[head(variables)] = head(values);
        return frame;
    }
}

function add_binding_to_frame(variable, value, frame) {
    frame[variable] = value;
    return undefined;
}

function has_binding_in_frame(variable, frame) {
    return has_own_property(frame, variable);
}

function define_variable(variable, value, env) {
    var frame = first_frame(env);
    return add_binding_to_frame(variable, value, frame);
}

function lookup_variable_value(variable, env) {
    function env_loop(env) {
        if (is_empty_environment(env)) {
            error("Unbound variable: " + variable);
        } else if (has_binding_in_frame(variable, first_frame(env))) {
            return first_frame(env)[variable];
        } else {
            return env_loop(enclosing_environment(env));
        }
    }

    return env_loop(env);
}

function extend_environment(vars, vals, base_env) {
    var var_length = length(vars);
    var val_length = length(vals);
    if (var_length === val_length) {
        var new_frame = make_frame(vars, vals);
        // The base environment is enclosed by the environment of new frame
        return enclose_by(new_frame, base_env);
    } else if (var_length < val_length) {
        error("Too many arguments supplied: " + vars + " " + vals);
    } else {
        error("Too few arguments supplied: " + vars + " " + vals);
    }
}


/*
*******************************************************************************
Functions to handle and evaluate variable definition statements.
*******************************************************************************
*/
function is_var_definition(stmt) {
    return is_tagged_object(stmt, "var_definition");
}
function var_definition_variable(stmt) {
    return stmt.variable;
}
function var_definition_value(stmt) {
    return stmt.value;
}

function evaluate_var_definition(stmt, env) {
    define_variable(var_definition_variable(stmt),
                    evaluate(var_definition_value(stmt), env),
                    env);
    return undefined;
}


/*
*******************************************************************************
Functions to handle and evaluate a sequence of statements.
A sequence is represented as a list of statements.
*******************************************************************************
*/
function is_sequence(stmt) {
    return is_list(stmt);
}

function is_last_statement(stmts) {
    return is_empty_list(tail(stmts));
}

function first_statement(stmts) {
    return head(stmts);
}

function rest_statements(stmts) {
    return tail(stmts);
}

function evaluate_sequence(stmts, env) {
    if (is_last_statement(stmts)) {
        // If there is only 1 statement, evaluate it.
        // You cannot wait until an empty list which cannot return any value
        return evaluate(first_statement(stmts), env);
    } else {
        // Evaluate the first statement
        var first_stmt_value = evaluate(first_statement(stmts), env);
        return evaluate_sequence(rest_statements(stmts), env);
    }
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

function apply_primitive_function(fun, argument_list) {
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
function list_of_values(exps, env) {
    if (no_operands(exps)) {
        return [];
    } else {
        return pair(evaluate(first_operand(exps), env),
                    list_of_values(rest_operands(exps), env));
    }
}


/*
*******************************************************************************
The function evaluate takes as arguments a statement. It classifies the 
statement and directs its evaluation. Each type of statement has a predicate 
that tests for it and an abstract means for selecting its parts.
*******************************************************************************
*/
function evaluate(stmt, env) {
    if (is_self_evaluating(stmt)) {
        return stmt;
    } else if (is_variable(stmt)) {
        return lookup_variable_value(variable_name(stmt), env);
    } else if (is_var_definition(stmt)) {
        return evaluate_var_definition(stmt, env);
    } else if (is_sequence(stmt)) {
        return evaluate_sequence(stmt, env);
    } else if (is_application(stmt)) {
        return apply(evaluate(operator(stmt), env),
                     list_of_values(operands(stmt), env));
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
    // These low-level basic arithmetic operations cannot be implemented here
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

function primitive_function_names() {
    return map(function(x) { return head(x); },
               primitive_functions);
}

function primitive_function_objects() {
    return map(function (f) {
        return {
            tag: "primitive",
            implementation: tail(f)
            };
        }, primitive_functions);
}


/*
*******************************************************************************
Running the Evaluator.
*******************************************************************************
*/
function setup_environment() {
    var initial_env = extend_environment(primitive_function_names(),
                                         primitive_function_objects(),
                                         the_empty_environment);
    return initial_env;
}

var the_global_environment = setup_environment();


function evaluate_toplevel(stmt, env) {
    var value = evaluate(stmt, env);
    return value;
}

function parse_and_evaluate(string) {
    return evaluate_toplevel(parse(string),
                             the_global_environment);
}


/*
*******************************************************************************
Testing.
*******************************************************************************
*/

/* TRY THIS:
parse_and_evaluate("var x = 12 + 3; var y = 2; x * y;");
*/

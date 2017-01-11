///////////////////////
// evaluator4.ts
///////////////////////


function is_tagged_object(stmt, the_tag) {
    return is_object(stmt) &&
        stmt.tag === the_tag;
}


/*
*******************************************************************************
Functions to handle and evaluate primitive values.
*******************************************************************************
*/
function is_self_evaluating(stmt) {
    return is_number(stmt) ||
        is_string(stmt) ||
        is_boolean(stmt);
}

function is_empty_list_statement(stmt) {
    return is_tagged_object(stmt, "empty_list");
}

function evaluate_empty_list_statement(stmt, env) {
    return [];
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
Functions to handle and evaluate conditional statements.
*******************************************************************************
*/
function is_if_statement(stmt) {
    return is_tagged_object(stmt, "if");
}

function if_predicate(stmt) {
    return stmt.predicate;
}

function if_consequent(stmt) {
    return stmt.consequent;
}

function if_alternative(stmt) {
    return stmt.alternative;
}

function is_true(x) {
    return x === true;
}

function is_false(x) {
    return x === false;
}

function evaluate_if_statement(stmt, env) {
    if (is_true(evaluate(if_predicate(stmt), env))) {
        return evaluate(if_consequent(stmt), env);
    } else {
        return evaluate(if_alternative(stmt), env);
    }
}


/*
*******************************************************************************
Functions to handle and evaluate function definitions.
*******************************************************************************
*/
function is_function_definition(stmt) {
    return is_tagged_object(stmt, "function_definition");
}

function function_definition_parameters(stmt) {
    return stmt.parameters;
}

function function_definition_body(stmt) {
    return stmt.body;
}

function evaluate_function_definition(stmt, env) {
    return make_function_value(
        function_definition_parameters(stmt),
        function_definition_body(stmt),
        env);
}


/*
*******************************************************************************
Functions to handle function values.
*******************************************************************************
*/
function make_function_value(parameters, body, env) {
    return { tag: "function_value",
        parameters: parameters,
        body: body,
        environment: env
    };
}

function is_compound_function_value(f) {
    return is_tagged_object(f, "function_value");
}

function function_value_parameters(value) {
    return value.parameters;
}

function function_value_body(value) {
    return value.body;
}

function function_value_environment(value) {
    return value.environment;
}

function function_value_name(value) {
    return value.name;
}


/*
*******************************************************************************
Functions to handle return statements and return values.
*******************************************************************************
*/
function is_return_statement(stmt) {
    return is_tagged_object(stmt, "return_statement");
}
function return_statement_expression(stmt) {
    return stmt.expression;
}

function make_return_value(content) {
    return { tag: "return_value", content: content };
}

function is_return_value(value) {
    return is_tagged_object(value, "return_value");
}

function return_value_content(value) {
    return value.content;
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
        return evaluate(first_statement(stmts), env);
    } else {
        var first_stmt_value =
            evaluate(first_statement(stmts), env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        } else {
            return evaluate_sequence(
            rest_statements(stmts), env);
        }
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
to which the function should be applied. The function apply classifies
functions into two kinds: It calls apply_primitive_function to apply
primitives; it applies compound functions by sequentially evaluating the
expressions that make up the body of the function. The environment for the
evaluation of the body of a compound function is constructed by extending
the base environment carried by the function to include a frame that binds
the parameters of the function to the arguments to which the function is to
be applied.

In order to return a value, functions need to evaluate a return statement.
If a function terminates without return, the value undefined is returned.
Thus, if the evaluation of the function body yields a return value, the
corresponding return expression is returned, and otherwise the value
undefined is returned.
*******************************************************************************
*/
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function_value(fun)) {
        if (length(function_value_parameters(fun)) === length(args)) {
            var env = extend_environment(function_value_parameters(fun),
                                         args,
                                         function_value_environment(fun));
            var result = evaluate(function_value_body(fun), env);
            if (is_return_value(result)) {
                return return_value_content(result);
            } else {
                return undefined;
            }
        } else {
            error("Incorrect number of arguments supplied for function");
        }
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
The function evaluate takes as arguments a statement and an environment. It
classifies the statement and directs its evaluation. Each type of statement
has a predicate that tests for it and an abstract means for selecting its
parts.

PRIMITIVE EXPRESSIONS:
* If the given statement is a self-evaluating expression, such as a number,
evaluate returns the expression itself.
* The function evaluate must look up variables in the environment to find
their values.

SPECIAL FORMS:
* A definition of a variable must recursively call evaluate to compute the
new value to be associated with the variable. The environment must be
modified to change (or create) the binding of the variable.
* An if statement requires special processing of its parts, so as to
evaluate the consequent if the predicate is true, and otherwise to evaluate
the alternative.
* A function definition must be transformed into an applicable function by
packaging together the parameters and body specified by the lambda
expression with the environment of the evaluation.
* A sequence of statements requires evaluating its component statements in
the order in which they appear.

COMBINATIONS:
* For a function application, evaluate must recursively evaluate the
operator part and the operands of the combination. The resulting function
and arguments are passed to apply, which handles the actual function
application.
* When evaluate encounters a return statement, the return expression is
evaluated and marked as a return value.
*******************************************************************************
*/
function evaluate(stmt, env) {
    if (is_self_evaluating(stmt)) {
        return stmt;
    } else if (is_empty_list_statement(stmt)) {
        return evaluate_empty_list_statement(stmt, env);
    } else if (is_variable(stmt)) {
        return lookup_variable_value(variable_name(stmt), env);
    } else if (is_var_definition(stmt)) {
        return evaluate_var_definition(stmt, env);
    } else if (is_if_statement(stmt)) {
        return evaluate_if_statement(stmt, env);
    } else if (is_function_definition(stmt)) {
        return evaluate_function_definition(stmt, env);
    } else if (is_sequence(stmt)) {
        return evaluate_sequence(stmt, env);
    } else if (is_application(stmt)) {
        return apply(
            evaluate(operator(stmt), env),
            list_of_values(operands(stmt), env));
    } else if (is_return_statement(stmt)) {
        return make_return_value(
            evaluate(return_statement_expression(stmt),
                     env));
    } else {
        error("Unknown expression type -- evaluate: " + stmt);
    }
}


/*
*******************************************************************************
Specify and define the built-in and primitive functions.
*******************************************************************************
*/
var primitive_functions =
    list(
//Builtin functions
        pair("alert", alert),
        pair("prompt", prompt),
        pair("parseInt", parseInt),

//List library functions
        pair("pair", pair),
        pair("head", head),
        pair("tail", tail),
        pair("list", list),
        pair("length", length),
        pair("map", map),
        pair("is_empty_list", is_empty_list),

//Intepreter functions
        pair("parse", parse),
        pair("error", error),

//Primitive functions
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
    return map(
        function(f) {
            return { tag: "primitive",
                     implementation: tail(f)
            };
        },
        primitive_functions);
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
    if (is_return_value(value)) {
        error("return not allowed outside of function definition");
    } else {
        return value;
    }
}

function parse_and_evaluate(string) {
    return evaluate_toplevel(parse(string),
                             the_global_environment);
}

function driver_loop() {
    // system.runtime_limit.set_timeout(1000000); // set timeout limit to 1000 sec
    var program_string = prompt("Enter your program here: ");
    var program_syntax = parse(program_string);
    if (is_tagged_object(program_syntax, "exit")) {
        return "interpreter completed";
    } else {
        var output = evaluate_toplevel(program_syntax, the_global_environment);
        alert(output);
        return driver_loop();
    }
}


/*
*******************************************************************************
Testing.
*******************************************************************************
*/

/* TRY THIS:
parse_and_evaluate("
function append(xs,ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else {
        return pair(head(xs),
                    append(tail(xs),ys));
    }
}
append(list(1,2),list(3,4));
");
*/
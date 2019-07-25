function make_table() {
    return pair("table", []);
}

function is_empty_table(table) {
    return is_empty_list(tail(table));
}

function has_key(key, table) {
    return accumulate(function (x, accum) {
        return accum || head(x) === key;
    }, false, tail(table));
}

function lookup(key, table) {
    if (has_key(key, table)) {
        return tail(head(filter(function (x) {
            return head(x) === key;
        }, tail(table))));
    } else {

    }
}

function insert(key, value, table) {
    set_tail(table, pair(pair(key, value), tail(table)));
}

function memoize(func) {
    var table = make_table();
    return function (x) {
        if (has_key(x, table)) {
            return lookup(x, table);
        } else {
            var result = func(x);
            insert(x, result, table);
            return result;
        }
    };
}

function fibo(x) {
    return x <= 1 ? x : fibo(x - 1) + fibo(x - 2);
}

function fibo_iter(x) {
    function iter(count, last1, last2) {
        return count === x ? last1 + last2
                           : iter(count + 1, last1 + last2, last1);
    }

    return x <= 1 ? x : iter(2, 1, 0);
}

var fibo_memo = memoize(function (x) {
    return x <= 1 ? x : fibo_memo(x - 1) + fibo_memo(x - 2);
});

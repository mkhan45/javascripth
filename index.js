class Fn {
    constructor(expr, argnames) {
        this.expr = expr;
        this.argnames = argnames;
    }

    compile(interpreter) {
        return args => {
            if (this.argnames) {
                let args_dict = {};
                for (let i = 0; i < this.argnames.length; i += 1) {
                    const arg_name = this.argnames[i];
                    const arg_val = args[i];
                    args_dict[arg_name] = arg_val;
                }

                args = args_dict;
            }

            const new_interpreter = new Interpreter();
            for (let k in args) {
                args[k] = interpreter.eval(args[k]);
            }
            new_interpreter.state = {...interpreter.state, ...new_interpreter.state, ...args};
            return new_interpreter.eval(this.expr);
        }
    }
}

class Interpreter {
    constructor() {
        this.state = {
            '+': args => args.reduce((a, b) => a + b, 0),
            '-': args => args.slice(1).reduce((a, b) => a - b, args[0]),
            '*': args => args.reduce((a, b) => a * b, 1),
            '/': args => args.slice(1).reduce((a, b) => a / b, args[0]),
            'eq': ([lhs, rhs]) => lhs == rhs,
            'lt': ([lhs, rhs]) => lhs < rhs,
            'gt': ([lhs, rhs]) => lhs > rhs,
        };
    }

    eval(expr) {
        if (typeof expr === 'number' || typeof expr === 'boolean') {
            return expr;
        }

        if (typeof expr === 'string') {
            return this.state[expr];
        }

        if (Array.isArray(expr)) {
            if (expr.length === 1) {
                return this.eval(expr[0]);
            } else {
                return expr.map(s => this.eval(s));
            }
        }

        const res = Object.keys(expr).map(key => {
            let args = expr[key];

            if (key === 'def') {
                for (const name in args) {
                    this.state[name] = i.eval(args[name]);
                }
                return;
            }

            if (key === 'fn') {
                if (Array.isArray(args)) {
                    // contains argnames list
                    const [argnames, expr] = args;
                    const fn = new Fn(expr, argnames);
                    return fn.compile(this);
                } else {
                    // only contains expr
                    const expr = args;
                    const fn = new Fn(expr);
                    return fn.compile(this);
                }
            }

            if (key === 'if') {
                const cond = this.eval(args['cond']);
                if (cond) {
                    return this.eval(args['then']);
                } else {
                    return this.eval(args['else']);
                }
            }

            if (args.map)
                args = args.map(e => this.eval(e));
            if (key in this.state && typeof this.state[key] === 'function') {
                return this.state[key](args);
            }
        })

        if (res.length === 1) {
            return res[0];
        } else {
            return res;
        }
    }
}

const i = new Interpreter();
let thirty = {'+': [5, 10, 15]};
let thirty_mul_3 = {'*': [thirty, 3]};

let set_a_5 = {def: {a: 5}};
i.eval(set_a_5);

let fn_def = {fn: {'*': ['a', 2]}};
i.eval({def: {f: fn_def}});
let res = i.eval({f: {a: {f: {a: 12}}}});
console.log(`48: ${res}`);

fn_def = {fn: [['i', 'j'], {'*': ['i', 'j']}]}
i.eval({def: {f1: fn_def}});
res = i.eval({f1: [2, 3]});
console.log(`6: ${res}`);

let fact_expr = {'if': {cond: {eq: ['n', 1]}, then: 1, else: {'*': ['n', {fact: [{'-': ['n', 1]}]}]}}};
i.eval({def: {fact: {fn: [['n'], fact_expr]}}});
res = i.eval({fact: [5]})
console.log(`120: ${res}`);

let m_is_0 = {eq: ['m', 0]}
let n_is_0 = {eq: ['n', 0]}
let ack_expr = {
   'if': {
       cond: m_is_0, 
       then: {'+': ['n', 1]},
       else: {
           'if': {
               cond: n_is_0,
               then: {'ack': [{'-': ['m', 1]}, 1]},
               else: {'ack': [
                    {'-': ['m', 1]},
                    {'ack': ['m', {'-': ['n', 1]}]},
               ]}
           }
       }
   }
}
i.eval({def: {ack: {fn: [['m', 'n'], ack_expr]}}});

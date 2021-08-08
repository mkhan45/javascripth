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
            'eq': ([lhs, rhs]) => JSON.stringify(lhs) == JSON.stringify(rhs), // lol
            'lt': ([lhs, rhs]) => lhs < rhs,
            'gt': ([lhs, rhs]) => lhs > rhs,
            'or': ([lhs, rhs]) => lhs || rhs,
            'and': ([lhs, rhs]) => lhs && rhs,
            'head': ls => Array.isArray(ls) ? ls[0] : ls,
            'tail': ls => Array.isArray(ls) ? ls.slice(1) : [],
            'concat': lists => lists.reduce((a, b) => a.concat(b), []),
            'mod': ([lhs, rhs]) => lhs % rhs,
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
            return expr.map(s => this.eval(s));
        }

        const res = Object.keys(expr).map(key => {
            let args = expr[key];

            if (key === 'def') {
                for (const name in args) {
                    this.state[name] = this.eval(args[name]);
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

            if (key === 'print') {
                console.log(this.eval(args));
                return;
            }

            if (args.map)
                args = args.map(e => this.eval(e));
            else
                args = this.eval(args);

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

export { Interpreter }

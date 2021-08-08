# javascripth
Lispy JSON evaluator

ex:
calculate the 10th fibonacci number
```json
[
    {"def": {"fib": {"fn": [["n"],
        {"if": {"cond": {"lt": ["n", 2]},
            "then": 1,
            "else": {"+": [
                {"fib": [{"-": ["n", 1]}]},
                {"fib": [{"-": ["n", 2]}]}
            ]}
        }}
    ]}}},
    {"print": {"fib": [10]}}
]
```

### FAQ

what?

The premier no-code programming language. If you can read and write JSON but don't know how to code, javascripth is the language for you.

why?

???

### Usage

1. Clone the repo: `git clone https://github.com/mkhan45/javascripth.git`
2. Navigate to the javascripth folder `cd javascripth`
3. To run a REPL, use `node repl.js`. To run a file, use `node run.js <file path>`

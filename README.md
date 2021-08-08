# javascripth
stupid json eval lisp

ex:
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

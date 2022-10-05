# Run test
  ```node ./__tests__/run.js```

  OR

  ``` npm run tests```

  If you have nodemon installed you can automatically run the test on any file change

  ``` npm run watch-tests```

# Features

- [X] Simple expression parser
- [X] Artimetic expression
- [X] Variables
  - [X] Environment interface
    - [X] Define a variable -> (var x 10)
    - [X] Lookup a variable -> x
    - [X] Install some variables to globals like null, true, false etc.
    - [X] Handle variable types like true, false as boolean instead of string
    - [ ] Assign a new value to a variable -> (set x 20)
- [X] Blocks
  - [X] Block declaration
  - [X] Nested env/scope
  - [X] Access outer variable by inner scope
- [X] Refactor Tests
- [X] Branch expression
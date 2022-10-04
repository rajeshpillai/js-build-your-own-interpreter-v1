const assert = require('assert');
const { env } = require('process');
const Environment = require('./environment');

// Our interpreter

// Basic BNF grammar
/*
Exp ::= Number
    | String
    | [+ Number, Number]
    ;

The above expression can handle
  [+, 5, 10] but cannot handle [+, [+ 2, 3], 10]

Recursive Expr: (to the rescue)

Exp ::= Number
    | String
    | [+ Exp, Exp]
    ;

*/

class Eva {
  // Creates an Eva instance with the global environment
  constructor(global = new Environment()) {
    this.global = global;
  }
  
  eval(exp, env = this.global) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1,-1);
    }
    
    // Math operations:

    if(exp[0] === '+') {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if(exp[0] === '*') {
      return this.eval(exp[1], env) * this.eval(exp[2],env);
    }

    // TODO: Implement div, mult etc.


    // Block: sequence of expressions
    if (exp[0] === 'begin') {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // Variable declaration: var foo 100 <- talk about environment (storage of all vars and funcs in scope)
    if(exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // Variable access:
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach(exp => {
      result = this.eval(exp, env);
    });
    return result;
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

// Tests: 
const eva = new Eva(new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
}));

// Math:
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"Hello"'), "Hello");
assert.strictEqual(eva.eval(['+',1,5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3,2],5]),10);
assert.strictEqual(eva.eval(['+', ['*', 3,2],5]),11);

// Variables:
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);

assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
assert.strictEqual(eva.eval('y'), 100);
assert.strictEqual(eva.eval('VERSION'), '0.1');

// var isUser = true;
assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);


// More test for variable evaluation
assert.strictEqual(eva.eval(['var', 'z', ['*', 2,2]]), 4);

// Blocks: 
assert.strictEqual(eva.eval(
  ['begin',
  ['var', 'x', 10],
  ['var', 'y', 20],
  ['+', ['*', 'x' ,  'y'], 30],
  ]),
230);

// Evaluate block in it's own environment
assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'x', 10],
    ['begin',
      ['var', 'x', 20],
      'x'
    ],
    'x'
  ]), 
10);

// Access variable from outer env
assert.strictEqual(eva.eval(
  ['begin',
    ['var', 'value', 10],
    ['var', 'result', ['begin',
      ['var', 'x', ['+', 'value', 10]], // 'value' is in outer scope
      'x'
    ]],
    'result'  // return 'result'
  ]), 
20);

console.log('All assertions passed.');




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

    if(exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    if(exp[0] === '*') {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    // Implement div, mult etc.

    // Variable declaration <- talk about environment (storage of all vars and funcs in scope)
    if(exp[0] === 'var') {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value));
    }

    // Variable access:
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
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

console.log('All assertions passed.');




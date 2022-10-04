const assert = require('assert');

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
  eval(exp) {
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

    throw 'Unimplemented';
  }

}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

const eva = new Eva();

assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"Hello"'), "Hello");
assert.strictEqual(eva.eval(['+',1,5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3,2],5]),10);
assert.strictEqual(eva.eval(['+', ['*', 3,2],5]),11);

console.log('All assertions passed.');




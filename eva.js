const assert = require('assert');

class Eva {
  eval(exp) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1,-1);
    }

    if(exp[0] === '+') {
      return exp[1] + exp[2];
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

console.log('All assertions passed.');

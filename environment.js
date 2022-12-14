// Envoronment: names storae.
class Environment {
  
  // Creates an env with the given record
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  /*
    Creates a variable with the given name and value
  */
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  // Updtes an existing variable
  assign(name, value) {
    this.resolve(name).record[name] = value;
  }

  // Returns the value of a defined variable or throws undefined
  lookup(name) {
    return this.resolve(name).record[name];
  }

  /* Scope  chain */
  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if(this.parent == null) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }
    return this.parent.resolve(name);
  }
}

module.exports = Environment;
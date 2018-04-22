'use strict'

class Security {
  static get type() {
    throw new Error(`'type' is not defined for ${this.name}`)
  }

  static get in() {
    throw new Error(`'in' is not defined for ${this.name}`)
  }

  static _buildSpec() {
    if (this._spec) {
      return
    }

    this._spec = {}
    this._spec[this.name] = {
      type: this.type,
      in:   this.in,
      name: this.name
    }
  }

  static get spec() {
    this._buildSpec()
    return this._spec
  }
}

module.exports = Security

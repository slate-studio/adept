'use strict'

const { Security } = require('../../lib')

class Scope extends Security {
  static get in() {
    return 'header'
  }

  static get type() {
    return 'apiKey'
  }
}

module.exports = Scope

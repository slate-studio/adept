'use strict'

const Unit      = require('./unit')
const { Index } = require('../../lib')

class IndexUnits extends Index {
  static get tags() {
    return [ 'Units' ]
  }

  static get resource() {
    return Unit
  }
}

module.exports = IndexUnits

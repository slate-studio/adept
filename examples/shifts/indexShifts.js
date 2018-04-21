'use strict'

const Shift     = require('./shift')
const { Index } = require('../../lib')

class IndexShifts extends Index {
  static get resource() {
    return Shift
  }
}

module.exports = IndexShifts

'use strict'

const Shift     = require('../models/shift')
const { Index } = require('../../lib')

class IndexShifts extends Index {
  static get tags() {
    return [ 'Shifts' ]
  }

  static get resource() {
    return Shift
  }
}

module.exports = IndexShifts

'use strict'

const Unit     = require('../models/unit')
const { Read } = require('../../lib')

class ReadUnit extends Read {
  static get resource() {
    return Unit
  }
}

module.exports = ReadUnit

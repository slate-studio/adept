'use strict'

const Unit     = require('./unit')
const { Read } = require('../../lib')

class ReadUnit extends Read {
  static get resource() {
    return Unit
  }
}

module.exports = ReadUnit

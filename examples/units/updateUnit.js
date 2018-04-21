'use strict'

const Unit            = require('./unit')
const UpdateUnitInput = require('./updateUnitInput')
const { Update }      = require('../../lib')

class UpdateUnit extends Update {
  static get resource() {
    return Unit
  }

  static get input() {
    return UpdateUnitInput
  }
}


module.exports = UpdateUnit

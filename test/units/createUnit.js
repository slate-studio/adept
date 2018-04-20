'use strict'

const Unit            = require('./unit')
const CreateUnitInput = require('./createUnitInput')
const { Create } = require('../../lib')

class CreateUnit extends Create {
  static get resource() {
    return Unit
  }

  static get input() {
    return CreateUnitInput
  }
}

module.exports = CreateUnit

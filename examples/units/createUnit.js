'use strict'

const Unit         = require('./unit')
const { Create }   = require('../../lib')
const { security } = require('../securities')
const CreateUnitInput = require('./createUnitInput')

class CreateUnit extends Create {
  static get tags() {
    return [ 'Units' ]
  }

  static get resource() {
    return Unit
  }

  static get input() {
    return CreateUnitInput
  }

  static get security() {
    return security
  }
}

module.exports = CreateUnit

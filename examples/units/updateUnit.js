'use strict'

const Unit            = require('../models/unit')
const UpdateUnitInput = require('./updateUnitInput')
const { Update }      = require('../../lib')

class UpdateUnit extends Update {
  static get tags() {
    return [ 'Units' ]
  }

  static get resource() {
    return Unit
  }

  static get input() {
    return UpdateUnitInput
  }
}


module.exports = UpdateUnit

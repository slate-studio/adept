'use strict'

const Unit       = require('../../models/unit')
const { Update } = require('../../../lib')
const UpdateUnitInput = require('./inputs/updateUnitInput')

class UpdateUnit extends Update {
  static get tags() {
    return [ 'Units' ]
  }

  static get resource() {
    return Unit
  }

  static get mutation() {
    return UpdateUnitInput
  }
}


module.exports = UpdateUnit

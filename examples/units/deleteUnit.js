'use strict'

const Unit       = require('./unit')
const { Delete } = require('../../lib')

class DeleteUnit extends Delete {
  static get tags() {
    return [ 'Units' ]
  }

  static get resource() {
    return Unit
  }
}


module.exports = DeleteUnit

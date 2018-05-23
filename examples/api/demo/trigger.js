'use strict'

const { Operation } = require('../../../lib')

class Trigger extends Operation {
  static get tags() {
    return [ 'Demo' ]
  }

  static get responses() {
    return {
      'No Content': {}
    }
  }
}

module.exports = Trigger

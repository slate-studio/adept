'use strict'

const { Operation } = require('../../../lib')

class Spec extends Operation {
  static get tags() {
    return [ 'Common' ]
  }

  static get summary() {
    return 'Service API specification'
  }

  static get description() {
    return 'Returns specification for the service API.'
  }
}

exports = module.exports = Spec

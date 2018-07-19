'use strict'

const { Operation } = require('../../../lib')

class Health extends Operation {
  static get tags() {
    return [ 'Common' ]
  }

  static get summary() {
    return 'Service health check'
  }

  static get description() {
    return 'Returns version of the sevice and API.'
  }

  static get responses() {
    return {
      'OK': {
        description: 'Service is healthy'
      }
    }
  }
}

exports = module.exports = Health

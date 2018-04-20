'use strict'

const Resource = require('./resource')

class Query extends Resource {
  static get method() {
    return 'get'
  }

  static get output() {
    return this.resource
  }
}

module.exports = Query

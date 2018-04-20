'use strict'

const Resource = require('./resource')

class Mutation extends Resource {
  static get method() {
    return 'post'
  }

  static get input() {
    return this.resource
  }

  static get output() {
    return this.resource
  }
}

module.exports = Mutation

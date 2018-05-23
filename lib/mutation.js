'use strict'

const Resource = require('./resource')

class Mutation extends Resource {
  static get method() {
    if (this.responses.Created) {
      return 'post'
    }

    return 'patch'
  }

  static get mutation() {
    return this.resource
  }
}

module.exports = Mutation

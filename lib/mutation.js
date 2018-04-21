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

  static get references() {
    return this._references || [ this.input, this.output ]
  }
}

module.exports = Mutation

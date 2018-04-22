'use strict'

const Operation = require('./operation')

class Resource extends Operation {
  static get resource() {
    throw new Error(`'resource' is not defined for ${this.name}`)
  }

  static get resourceName() {
    return this.resource.name
  }

  static get collectionName() {
    return `${this.resource.name}s`
  }
}

module.exports = Resource

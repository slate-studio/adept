'use strict'

const Operation = require('./operation')

class Resource extends Operation {
  static get resource() {
    throw new Error(`${this.name}.resource is not defined`)
  }

  static get resourceName() {
    return this.resource.name
  }

  static get collectionName() {
    return `${this.resource.name}s`
  }

  static get output() {
    return this.resource
  }
}

module.exports = Resource

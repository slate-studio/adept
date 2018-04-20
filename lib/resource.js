'use strict'

const Operation = require('./operation')

class Resource extends Operation {
  static get resource() {
    throw new Error(`Resource is not defined for ${this.name}`)
  }

  static get resourceName() {
    return this.resource.name
  }

  static get resourceNameLowcase() {
    return this.resourceName.toLowerCase()
  }

  static get collectionName() {
    return `${this.resourceName}s`
  }

  static get collectionNameLowcase() {
    return this.collectionName.toLowerCase()
  }
}

module.exports = Resource

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
    return this.resource.nameLowcase
  }

  static get collectionName() {
    return this.resource.namePlural
  }

  static get collectionNameLowcase() {
    return this.resource.nameLowcasePlural
  }

  static get references() {
    return this._references || [ this.resource ]
  }
}

module.exports = Resource

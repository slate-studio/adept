'use strict'

const Operation = require('./operation')
const toLower   = require('lodash.tolower')

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

  static get bodyParameterName() {
    return toLower(this.resourceName)
  }
}

module.exports = Resource

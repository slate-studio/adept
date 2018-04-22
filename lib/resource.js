'use strict'

const Operation = require('./operation')

class Resource extends Operation {
  static get resource() {
    throw new Error(`Resource is not defined for ${this.name}`)
  }

  static get resourceName() {
    return this.resource.name
  }

  static get collectionName() {
    return `${this.resource.name}s`
  }

  // static get resourceNameLowcase() {
  //   return this.resource.nameLowcase
  // }

  // static get collectionNameLowcase() {
  //   return this.resource.nameLowcasePlural
  // }

  // static get namePlural() {
  //   return `${this.name}s`
  // }

  // static get nameLowcase() {
  //   return this.name.toLowerCase()
  // }

  // static get nameLowcasePlural() {
  //   return `${this.nameLowcase}s`
  // }
}

module.exports = Resource

'use strict'

const Validator = require('./Validator')

class Definition extends Validator {
  static get isDefinition() {
    return true
  }

  static get id() {
    return this.name
  }

  static get schema() {
    new Error(`'schema' is not defined for ${this.name}`)
  }

  static get namePlural() {
    return `${this.name}s`
  }

  static get nameLowcase() {
    return this.name.toLowerCase()
  }

  static get nameLowcasePlural() {
    return `${this.nameLowcase}s`
  }

  static get spec() {
    const schema = {}

    const properties = Object.assign({}, this.schema)

    const required = []
    for (const name in properties) {
      if (properties[name].required) {
        required.push(name)
      }

      delete properties[name].required
    }

    schema.type       = 'object'
    schema.properties = properties

    if (required.length > 0) {
      schema.required = required
    }

    return schema
  }

  static reference(definition) {
    if (definition instanceof Object) {
      definition = definition.name
    }

    return { $ref: `#/definitions/${definition}` }
  }
}

module.exports = Definition

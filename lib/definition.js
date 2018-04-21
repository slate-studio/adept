'use strict'

const Validator = require('./Validator')

class Definition extends Validator {
  static get id() {
    return this.name
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

  static get schema() {
    throw new Error(`'schema' is not defined for ${this.name}`)
  }

  static get jsonSchema() {
    const schema = {}

    const properties = Object.assign({}, this.schema)

    const required = []
    for (const name in properties) {
      if (properties[name].required) {
        required.push(name)
      }

      delete properties[name].required
    }

    schema.id         = this.id
    schema.type       = 'object'
    schema.properties = properties

    if (required.length > 0) {
      schema.required = required
    }

    return schema
  }

  static get spec() {
    const spec = {}
    spec[this.id] = Object.assign({}, this.jsonSchema)
    delete spec[this.id].id
    return spec
  }

  static reference(definition) {
    if (definition instanceof Object) {
      // TODO: Add reference to the stack
      definition = definition.id
    }

    return { $ref: `#/definitions/${definition}` }
  }
}

module.exports = Definition

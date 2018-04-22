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

  static _buildSpec() {
    if (this._spec) {
      return
    }

    this._spec = {}
    this._spec[this.id] = Object.assign({}, this.jsonSchema)

    delete this._spec[this.id].id
  }

  static get spec() {
    this._buildSpec()
    return this._spec
  }

  static get references() {
    this._buildSpec()
    return this._references || []
  }

  static reference(definition) {
    if (!this._references) {
      this._references = []
    }

    if (definition instanceof Object) {
      this._references.push(definition)
      return { $ref: `#/definitions/${definition.id}` }
    }

    return { $ref: `#/definitions/${definition}` }
  }
}

module.exports = Definition

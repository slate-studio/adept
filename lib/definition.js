'use strict'

const Validator = require('./validator')
const cloneDeep = require('lodash.clonedeep')

class Definition extends Validator {
  static get id() {
    return this.name
  }

  static get schema() {
    throw new Error(`'schema' is not defined for ${this.id}`)
  }

  static get jsonSchema() {
    let schema

    const isSchemaTypeDefined = !!this.schema.type
    const isSchemaTypeObject  = this.schema.type instanceof Object

    if (isSchemaTypeDefined && !isSchemaTypeObject) {
      schema = cloneDeep(this.schema)

    } else {
      schema = {}
      const properties = cloneDeep(this.schema)

      const required = []
      for (const name in properties) {
        if (properties[name].required) {
          required.push(name)
        }

        delete properties[name].required
      }

      schema.type = 'object'
      schema.properties = properties

      if (required.length > 0) {
        schema.required = required
      }
    }

    schema.id = this.id
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
    return this._references || {}
  }

  static reference(definition) {
    this._references = this._references || {}

    if (definition instanceof Object) {
      this._references[definition.id] = definition
      return { $ref: definition.id }
    }

    return { $ref: definition }
  }
}

module.exports = Definition

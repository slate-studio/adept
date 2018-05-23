'use strict'

class Component {
  static get id() {
    return this.name
  }

  static get schema() {
    throw new Error(`${this.name}.schema is not defined`)
  }

  static get schemas() {
    if (!this._schemas) {
      this._schemas = this.schema.schemas
    }

    return this._schemas
  }

  static get references() {
    if (!this._references) {
      this._references = {}
      this.resolveReferences(this.schema.jsonSchema)
    }

    return this._references
  }

  static resolveReferences(schema) {
    if (!schema) {
      return
    }

    if (schema.$ref) {
      return this.resolveReference(schema.$ref)
    }

    if (schema.type == 'array') {
      return this.resolveReferences(schema.items)
    }

    if (schema.properties) {
      for (const name in schema.properties) {
        this.resolveReferences(schema.properties[name])
      }
    }
  }

  static resolveReference(id) {
    if (this._references[id]) {
      return
    }

    const schema = this.schemas[id]
    this._references[id] = schema

    this.resolveReferences(schema.jsonSchema)
  }
}

module.exports = Component

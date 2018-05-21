'use strict'

const Definition = require('./definition')

class Document extends Definition {
  static get schema() {
    throw Error(`Class method schema is not defined for ${this.name}`)
  }

  static getSchema() {
    throw Error(`Class method getSchema is not defined for ${this.name}`)
  }

  static resolveReferences(schema) {
    for (const name in schema) {
      for (const property in schema[name]) {
        let definitionName

        if (property == '$ref') {
          definitionName = schema[name].$ref

        } else if (property == 'items' && !!schema[name].items.$ref) {
          definitionName = schema[name].items.$ref

        }

        if (definitionName) {
          this.resolveReference(definitionName)
        }
      }
    }
  }

  static resolveReference(definitionName) {
    if (this._references && this._references[definitionName]) {
      return
    }

    const schema = this.getSchema(definitionName)
    this.resolveReferences(schema)

    const Model = class extends Definition {
      static get id() {
        return definitionName
      }

      static get schema() {
        return schema
      }
    }

    this.reference(Model)
  }

  constructor(attributes) {
    super()
    this.attributes = attributes || {}
  }

  toJSON() {
    return this.attributes
  }

  get id() {
    return this.attributes.id
  }
}

module.exports = Document

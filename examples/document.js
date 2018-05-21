'use strict'

const schemas   = require('./schemas')
const cloneDeep = require('lodash.clonedeep')
const { Document: AbstractDocument } = require('../lib')

class Document extends AbstractDocument {
  static getSchema(name) {
    return cloneDeep(schemas[name])
  }

  static get commonSchema() {
    const schema = this.getSchema('Common')
    this.resolveReferences(schema)

    return schema
  }

  static get documentSchema() {
    const schema = this.getSchema(this.name)
    this.resolveReferences(schema)

    return schema
  }

  static get schema() {
    const schema = Object.assign({}, this.commonSchema)
    Object.assign(schema, this.documentSchema)

    return schema
  }
}

module.exports = Document

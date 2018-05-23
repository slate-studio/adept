'use strict'

const schemas = require('./schemas')
const { Document: AbstractDocument } = require('../lib')

class Document extends AbstractDocument {
  static getSchema(name) {
    return schemas[name]
  }
}

module.exports = Document

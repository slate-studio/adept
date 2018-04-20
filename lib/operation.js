'use strict'

const statuses = require('statuses')

class Operation {
  static get isOperation() {
    return true
  }

  static get operationId() {
    throw new Error(`'operationId' is not defined for ${this.name}`)
  }

  static get description() {
  }

  static get summary() {
  }

  static get path() {
    return `/${this.operationId}`
  }

  static get method() {
    throw new Error(`'method' is not defined for ${this.name}`)
  }

  static get parameters() {
  }

  static get responses() {
    new Error(`'responses' are not defined for ${this.name}`)
  }

  static get securities() {
  }

  static get spec() {
    const operation = {}

    operation.operationId = this.operationId

    if (this.summary) {
      operation.summary = this.summary
    }

    if (this.description) {
      operation.description = this.description
    }

    if (this.parameters) {
      operation.parameters = this.parameters
    }

    const responses = this.responses
    operation.responses = {}

    for(const status in responses) {
      const statusCode = statuses(status)
      operation.responses[statusCode] = {
        description: statuses[statusCode]
      }

      if (responses[status].description) {
        operation.responses[statusCode].description = responses[status].description
      }

      if (responses[status].schema) {
        operation.responses[statusCode].schema = responses[status].schema
      }
    }

    const spec      = {}
    spec[this.path] = {}
    spec[this.path][this.method] = operation

    return spec
  }

  static reference(definition) {
    if (definition instanceof Object) {
      definition = definition.name
    }

    return { $ref: `#/definitions/${definition}` }
  }
}

module.exports = Operation

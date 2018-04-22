'use strict'

const camelCase  = require('lodash.camelcase')
const capitalize = require('lodash.capitalize')
const lowerCase  = require('lodash.lowercase')
const statuses   = require('statuses')

class Operation {
  static get id() {
    return camelCase(this.name)
  }

  static get path() {
    return `/${this.id}`
  }

  static get method() {
    throw new Error(`'method' is not defined for ${this.name}`)
  }

  static get summary() {
    return capitalize(lowerCase(this.id))
  }

  static get description() {
    return ''
  }

  static get securities() {
    return []
  }

  static get parameters() {
    return []
  }

  static get responses() {
    new Error(`'responses' are not defined for ${this.name}`)
  }

  static get spec() {
    const operation = {}

    operation.operationId = this.operationId
    operation.summary     = this.summary
    operation.description = this.description
    operation.parameters  = this.parameters

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

  static get references() {
    return []
  }

  static reference(definition) {
    if (definition instanceof Object) {
      definition = definition.id
    }

    return { $ref: `#/definitions/${definition}` }
  }
}

module.exports = Operation

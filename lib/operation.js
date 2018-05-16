'use strict'

const camelCase  = require('lodash.camelcase')
const capitalize = require('lodash.capitalize')
const lowerCase  = require('lodash.lowercase')
const cloneDeep  = require('lodash.clonedeep')
const statuses   = require('statuses')

class Operation {
  static get id() {
    return camelCase(this.name)
  }

  static get tags() {
    return []
  }

  static get path() {
    return `/${this.id}`
  }

  static get method() {
    return 'get'
  }

  static get summary() {
    return capitalize(lowerCase(this.id))
  }

  static get description() {
    return ''
  }

  static get security() {
    return []
  }

  static get parameters() {
    return []
  }

  static get responses() {
    return {
      'OK': {}
    }
  }

  static _buildSpec() {
    if (this._spec) {
      return
    }

    const operation = {}

    operation.operationId = this.id
    operation.summary     = this.summary
    operation.description = this.description
    operation.parameters  = this.parameters
    operation.tags        = this.tags

    const responses = this.responses
    operation.responses = {
      'default': {
        description: 'Default error',
        schema:      this.operationError
      }
    }

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

      } else {
        if (statusCode >= 400) {
          operation.responses[statusCode].schema = this.operationError
        }

      }

      if (responses[status].headers) {
        operation.responses[statusCode].headers = responses[status].headers
      }
    }

    if (this.security.length > 0) {
      operation.security = cloneDeep(this.security)

      for (const requirements of operation.security) {
        for (const name in requirements) {
          requirements[name] = requirements[name].options
        }
      }

      operation.responses[401] = {
        description: 'Unauthorized',
        schema:      this.operationError
      }

      operation.responses[403] = {
        description: 'Forbidden',
        schema:      this.operationError
      }
    }

    this._spec = {}
    this._spec[this.path] = {}
    this._spec[this.path][this.method] = operation
  }

  static get spec() {
    this._buildSpec()
    return this._spec
  }

  static get references() {
    this._buildSpec()
    return this._references
  }

  static get operationError() {
    return this.reference('OperationError')
  }

  static reference(definition) {
    this._references = this._references || []

    if (definition instanceof Object) {
      this._references.push(definition)
      return { $ref: `#/definitions/${definition.id}` }
    }

    return { $ref: `#/definitions/${definition}` }
  }

  get status() {
    return this._status
  }

  set status(status) {
    const isInternalServerError = status == 'Internal Server Error'
    const isAuthorizationError  = status == 'Unauthorized'
    const isPermissionsError    = status == 'Forbidden'
    const isResponseDefined     = !!this.constructor.responses[status]

    if (!isAuthorizationError && !isPermissionsError && !isInternalServerError && !isResponseDefined) {
      throw new Error(`Response '${status}' is not defined for ${this.constructor.id}`)
    }

    this._status = status
  }
}

module.exports = Operation

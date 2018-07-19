'use strict'

const clone      = require('lodash.clonedeep')
const camelCase  = require('lodash.camelcase')
const capitalize = require('lodash.capitalize')
const lowerCase  = require('lodash.lowercase')
const Schema     = require('./schema')

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
    if (this.mutation) {
      if (this.responses.Created) {
        return 'post'
      }

      return 'patch'
    }

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

  static get resource() {
    return null
  }

  static get resourceName() {
    if (!this.resource) {
      throw new Error(`${this.name}.resource is not defined`)
    }

    return this.resource.name
  }

  static get collectionName() {
    if (!this.resource) {
      throw new Error(`${this.name}.resource is not defined`)
    }

    return `${this.resource.name}s`
  }

  static get query() {
    return {}
  }

  static get mutation() {
    return null
  }

  static get output() {
    return this.resource
  }

  static get responses() {
    const responses = {
      OK: {}
    }

    if (this.output) {
      responses.OK.schema = this.reference(this.output)
    }

    return responses
  }

  static get operationError() {
    return this.reference('OperationError')
  }

  static reference(component) {
    this._references = this._references || {}

    if (component instanceof Object) {
      this._references[component.id] = component.schema
      Object.assign(this._references, component.references)

      return { $ref: component.id }
    }

    return { $ref: component }
  }

  static get references() {
    this._references = this._references || {}

    if (this.mutation) {
      this._references[this.mutation.id] = this.mutation.schema
    }

    return this._references
  }

  static get parametersSchema() {
    if (!this._parametersSchema) {
      const source = clone(this.query || {})

      if (this.mutation) {
        source.mutation = { $ref: this.mutation.id }
      }

      this._parametersSchema = new Schema(`${this.name}Parameters`, source)

      if (this.mutation) {
        this._parametersSchema.schemas = this.mutation.schemas
      }
    }

    return this._parametersSchema
  }

  static async buildParameters(queryParameters = {}, mutationParameters = {}) {
    if (!this.query && !this.mutation) {
      return { query: undefined, mutation: undefined }
    }

    const parameters = clone(queryParameters)

    if (this.mutation) {
      parameters.mutation = clone(mutationParameters)
    }

    this.parametersSchema.updateDefaults(parameters)

    try {
      await this.parametersSchema.validate(parameters)

    } catch (errors) {
      const error  = new Error('Validation error')
      error.status = 'Bad Request'
      error.originalError = { errors }

      throw error
    }

    const { mutation } = parameters

    delete parameters.mutation
    const query = parameters

    return { query, mutation }
  }

  get status() {
    return this._status
  }

  set status(status) {
    const isInternalServerError = status == 'Internal Server Error'
    const isAuthorizationError  = status == 'Unauthorized'
    const isPermissionsError    = status == 'Forbidden'
    const isBadRequest          = status == 'Bad Request'
    const isUnprocessableEntity = status == 'Unprocessable Entity'
    const isResponseDefined     = !!this.constructor.responses[status]

    if (!isBadRequest &&
        !isUnprocessableEntity &&
        !isAuthorizationError &&
        !isPermissionsError &&
        !isInternalServerError &&
        !isResponseDefined) {
      throw new Error(`Response '${status}' is not defined for ${this.constructor.id}`)
    }

    this._status = status
  }
}

module.exports = Operation

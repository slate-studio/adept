'use strict'

const clone      = require('lodash.clonedeep')
const Schema     = require('./Schema')
const Component  = require('./Component')
const lowerCase  = require('lodash.lowercase')
const capitalize = require('lodash.capitalize')

const OPERATION_TYPES = {
  CREATE: 'CREATE',
  READ:   'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

class Operation {
  static get id() {
    return this.name
  }

  static get types() {
    return OPERATION_TYPES
  }

  static get type() {
    return this.types.READ
  }

  static get tags() {
    return []
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

  static get inputSchema() {
    const source = clone(this.query)

    if (this.mutation) {
      source.mutation = this.reference(this.mutation, true)
    }

    const inputSchema = new Schema(`${this.name}Parameters`, source)
    inputSchema.schemas = this.references

    return inputSchema
  }

  static get output() {
    return this.resource
  }

  static get resultSchema() {
    if (!this.output) {
      throw new Error(`${this.name}.output is not defined`)
    }

    return this.output.schema
  }

  static get defaultError() {
    return 'OperationError'
  }

  static get errors() {
    return {}
  }

  static reference(target, isRequired = false) {
    this._references = this._references || {}

    if (!target) { return }

    let obj
    if (!Component.isComponent(target)) {
      obj = { $ref: target }

    } else {
      this._references[target.id] = target.schema
      Object.assign(this._references, target.references)

      obj = { $ref: target.id }

    }

    if (isRequired) {
      obj.required = true
    }

    return obj
  }

  static get references() {
    this.reference(this.mutation)
    this.reference(this.defaultError)

    for (const errorName in this.errors) {
      this.reference(this.errors[errorName])
    }

    return this._references
  }

  static buildValidators() {
    this.inputSchema.createValidator()

    if (this.output) {
      this.resultSchema.schemas = this.references
      this.resultSchema.createValidator()
    }
  }

  static isOperation(object) {
    if (!object.id) { return false }
    if (!object.type) { return false }

    return true
  }
}

module.exports = Operation

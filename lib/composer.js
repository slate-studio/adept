'use strict'

const Operation  = require('./operation')
const Definition = require('./definition')
const Security   = require('./security')
const keyBy      = require('lodash.keyby')

class Composer {
  constructor({ title, version, host, basePath, tags, modules }) {
    this._spec = {}
    this._spec.swagger = '2.0'
    this._spec.info    = {
      title:   title   || 'Service API Specification',
      version: version || 'X.X.X'
    }

    this._spec.schemes  = [ 'https', 'http' ]
    this._spec.host     = host     || 'swagger.io',
    this._spec.basePath = basePath || '/api'
    this._spec.consumes = [ 'application/json' ]
    this._spec.produces = [ 'application/json' ]
    this._spec.tags     = tags || []

    this._spec.securityDefinitions = {}
    this._spec.paths               = {}
    this._spec.definitions         = {}

    this._definitions = []
    this._operations  = []
    this._securities  = []

    const tagsMap = keyBy(this._spec.tags, 'name')

    for (const module of modules) {
      const klasses = Object.values(module)

      let definitions  = klasses.filter(k => k.prototype instanceof Definition)
      const operations = klasses.filter(k => k.prototype instanceof Operation)

      for (const operation of operations) {
        const { references, security, tags } = operation
        definitions = definitions.concat(references)

        const securityRequirements = security
        for (const requirements of securityRequirements) {
          for (const name in requirements) {
            this._securities.push(requirements[name].klass)
          }
        }

        for (const name of tags) {
          if (!tagsMap[name]) {
            this._spec.tags.push({ name })
            tagsMap[name] = { name }
          }
        }
      }

      for (const definition of definitions) {
        const { references } = definition
        definitions = definitions.concat(references)
      }

      this._definitions = this._definitions.concat(definitions)
      this._operations  = this._operations.concat(operations)
    }

    for (const security of this._securities) {
      Object.assign(this._spec.securityDefinitions, security.spec)
    }

    for (const operation of this._operations) {
      Object.assign(this._spec.paths, operation.spec)
    }

    for (const definition of this._definitions) {
      Object.assign(this._spec.definitions, definition.spec)
    }
  }

  get spec() {
    return this._spec
  }

  get operations() {
    return this._operations
  }
}

module.exports = Composer

'use strict'

const keyBy = require('lodash.keyby')
const clone = require('lodash.clonedeep')
const Operation = require('./Operation')
const Component = require('./Component')
const statuses  = require('statuses')

class Composer {
  constructor({ title, version, host, basePath, tags, modules, schemes }) {
    this._spec = {}
    this._spec.swagger = '2.0'
    this._spec.info    = {
      title:   title   || 'Service API Specification',
      version: version || 'X.X.X'
    }

    this._spec.schemes  = schemes || [ 'https', 'http' ]
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

      let components = klasses.filter(k => k.prototype instanceof Component)

      const operations = klasses
        .filter(k => k.prototype instanceof Operation)
        .map(_Operation => this.buildOperationSpec(_Operation))

      for (const operation of operations) {
        const { references, security, tags } = operation

        components = components.concat(Object.values(references))

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

      this._definitions = this._definitions.concat(components)
      this._operations  = this._operations.concat(operations)
    }

    for (const security of this._securities) {
      Object.assign(this._spec.securityDefinitions, security.spec)
    }

    for (const operation of this._operations) {
      Object.assign(this._spec.paths, operation.spec)
    }

    for (const definition of this._definitions) {
      const schema = clone(definition.jsonSchema)
      delete schema.id
      this._spec.definitions[definition.id] = schema
    }

    const updateDefinitionReferences = object => {
      for (const key in object) {
        if (key == '$ref') {
          object[key] = `#/definitions/${object[key]}`
        }

        if (object[key] instanceof Object) {
          updateDefinitionReferences(object[key])
        }
      }
    }

    updateDefinitionReferences(this._spec.paths)
    updateDefinitionReferences(this._spec.definitions)
  }

  buildOperationSpec(_Operation) {
    const spec = {}

    spec.operationId = _Operation.id
    spec.summary     = _Operation.summary
    spec.description = _Operation.description
    spec.tags        = _Operation.tags
    spec.parameters  = []

    if (_Operation.query) {
      for (const name in _Operation.query) {
        const parameter = Object.assign({ name, in: 'query' }, _Operation.query[name])
        spec.parameters
          .push(parameter)
      }
    }

    if (_Operation.mutation) {
      spec.parameters.push({
        name:     'mutation',
        in:       'body',
        schema:   { $ref: _Operation.mutation.id },
        required: true
      })
    }

    if (spec.parameters.length == 0) {
      delete spec.parameters
    }

    const responses = _Operation.responses
    spec.responses = {
      default: {
        description: 'Generic error',
        schema:      _Operation.operationError
      }
    }

    for (const status in responses) {
      const statusCode = statuses(status)
      spec.responses[statusCode] = {
        description: statuses[statusCode]
      }

      if (responses[status].description) {
        spec.responses[statusCode].description = responses[status].description
      }

      if (responses[status].schema) {
        spec.responses[statusCode].schema = responses[status].schema

      } else {
        if (statusCode >= 400) {
          spec.responses[statusCode].schema = _Operation.operationError
        }

      }

      if (responses[status].headers) {
        spec.responses[statusCode].headers = responses[status].headers
      }
    }

    if (_Operation.security.length > 0) {
      spec.security = clone(_Operation.security)

      for (const requirements of spec.security) {
        for (const name in requirements) {
          requirements[name] = []
        }
      }
    }

    _Operation.spec = {}
    _Operation.spec[_Operation.path] = {}
    _Operation.spec[_Operation.path][_Operation.method] = spec

    return _Operation
  }

  get spec() {
    return this._spec
  }

  get operations() {
    return this._operations
  }
}

module.exports = Composer

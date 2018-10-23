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

      let components = klasses.filter(k => Component.isComponent(k))

      const operations = klasses
        .filter(k => Operation.isOperation(k))
        .map(_Operation => this._buildOperationSpec(_Operation))

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

  _buildOperationQuery(_Operation, spec) {
    if (!_Operation.query) { return }

    for (const name in _Operation.query) {
      const parameter = Object.assign({ name, in: 'query' }, _Operation.query[name])
      spec.parameters.push(parameter)
    }
  }

  _buildOperationBody(_Operation, spec) {
    if (!_Operation.mutation) { return }

    spec.parameters.push({
      name:     'mutation',
      in:       'body',
      schema:   { $ref: _Operation.mutation.id },
      required: true
    })
  }

  _getSuccessStatus(_Operation) {
    if (!_Operation.output) { return 'No Content' }
    if (_Operation.type == _Operation.types.CREATE) { return 'Created' }

    return 'OK'
  }

  _buildOperationResponses(_Operation, spec) {
    spec.responses = {}

    const successStatus     = this._getSuccessStatus(_Operation)
    const successStatusCode = statuses(successStatus)

    spec.responses[successStatusCode] = {
      description: 'Success response'
    }

    if (successStatus !== 'No Content') {
      const jsonSchema = _Operation.resultSchema.jsonSchema
      delete jsonSchema.id

      spec.responses[successStatusCode]['schema'] = jsonSchema
    }

    spec.responses['default'] = {
      description: 'Default error response',
      schema:      _Operation.reference(_Operation.defaultError)
    }

    // TODO: Add other errors from _Operation.errors
    // TODO: Add support for headers if required
  }

  _buildOperationSecurity(_Operation, spec) {
    if (_Operation.security.length == 0) { return }

    spec.security = clone(_Operation.security)

    for (const requirements of spec.security) {
      for (const name in requirements) {
        requirements[name] = []
      }
    }
  }

  _getPath(_Operation) {
    return `/${_Operation.id}`
  }

  _getMethod(_Operation) {
    if (_Operation.type == _Operation.types.DELETE) { return 'delete' }
    if (_Operation.type == _Operation.types.CREATE) { return 'post' }
    if (_Operation.type == _Operation.types.UPDATE) { return 'patch' }

    return 'get'
  }

  _buildOperationSpec(_Operation) {
    _Operation.buildValidators()

    const spec = {}

    spec.operationId = _Operation.id
    spec.summary     = _Operation.summary
    spec.description = _Operation.description
    spec.tags        = _Operation.tags
    spec.parameters  = []

    this._buildOperationQuery(_Operation, spec)
    this._buildOperationBody(_Operation, spec)

    if (spec.parameters.length == 0) {
      delete spec.parameters
    }

    this._buildOperationResponses(_Operation, spec)
    this._buildOperationSecurity(_Operation, spec)

    const path   = this._getPath(_Operation)
    const method = this._getMethod(_Operation)

    _Operation.spec = {}
    _Operation.spec[path] = {}
    _Operation.spec[path][method] = spec

    // NOTE: Extending operation with HTTP specific attributes.
    _Operation.path   = path
    _Operation.method = method

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

'use strict'

const yaml = require('js-yaml')

const Operation  = require('./operation')
const Definition = require('./definition')
const Security   = require('./security')

class Composer {
  constructor({ title, version, host, basePath, modules }) {
    this.modules = modules || []

    this.options = {}
    this.options.swagger = '2.0'
    this.options.info    = {
      title:   title   || 'Service API Specification',
      version: version || 'X.X.X'
    }

    this.options.schemes  = [ 'http', 'https' ]
    this.options.host     = host     || 'swagger.io',
    this.options.basePath = basePath || '/api'
    this.options.consumes = [ 'application/json' ]
    this.options.produces = [ 'application/json' ]

    this.options.securityDefinitions = {}
    this.options.paths               = {}
    this.options.definitions         = {}
  }

  get spec() {
    const spec = Object.assign({}, this.options)


    for (const module of this.modules) {
      const klasses = Object.values(module)

      for (const klass of klasses) {
        if (klass.isOperation) {
          Object.assign(spec.paths, klass.spec)

        } else if (klass.isDefinition) {
          Object.assign(spec.definitions, klass.spec)

        } else if (klass.isSecurity) {
          Object.assign(spec.securityDefinitions, klass.spec)

        }
      }
    }

    return spec
  }

  get yaml() {
    return yaml.safeDump(this.spec)
  }
}

module.exports = Composer

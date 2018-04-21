'use strict'

const Operation  = require('./operation')
const Definition = require('./definition')
const Security   = require('./security')

class Composer {
  constructor({ title, version, host, basePath, modules }) {
    this.modules = modules

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

      let definitions  = klasses.filter(k => k.prototype instanceof Definition)
      const operations = klasses.filter(k => k.prototype instanceof Operation)
      const securities = klasses.filter(k => k.prototype instanceof Security)

      for (const security of securities) {
        Object.assign(spec.securityDefinitions, security.spec)
      }

      for (const operation of operations) {
        Object.assign(spec.paths, operation.spec)
        const { references } = operation
        definitions = definitions.concat(references)
      }

      for (const definition of definitions) {
        const { references } = definition

        console.log(references) // eslint-disable-line no-console

        definitions = definitions.concat(references)
      }

      for (const definition of definitions) {
        const obj = {}
        obj[definition.id] = definition.spec
        Object.assign(spec.definitions, obj)
      }
    }

    return spec
  }
}

module.exports = Composer

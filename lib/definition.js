'use strict'

class Definition {
  static get isDefinition() {
    return true
  }

  static get schema() {
    new Error(`'schema' is not defined for ${this.name}`)
  }

  static reference(definition) {
    if (definition instanceof Object) {
      definition = definition.name
    }

    return { $ref: `#/definitions/${definition}` }
  }

  static get namePlural() {
    return `${this.name}s`
  }

  static get nameLowcase() {
    return this.name.toLowerCase()
  }

  static get nameLowcasePlural() {
    return `${this.nameLowcase}s`
  }

  static get spec() {
    const definition = {}
    const spec       = {}

    const properties = Object.assign({}, this.schema)

    const required = []
    for (const name in properties) {
      if (properties[name].required) {
        required.push(name)
      }

      delete properties[name].required
    }

    spec.type       = 'object'
    spec.properties = properties

    if (required.length > 0) {
      spec.required = required
    }

    definition[this.name] = spec

    return definition
  }
}

module.exports = Definition

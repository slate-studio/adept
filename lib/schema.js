'use strict'

const yaml  = require('js-yaml')
const fs    = require('fs')
const pick  = require('lodash.pick')
const clone = require('lodash.clonedeep')
const ZSchema = require('z-schema')
const Promise = require('bluebird')

const log = console

class Schema {
  constructor(id, source) {
    this.id     = id
    this.source = source
  }

  clone(name, options = {}) {
    let source

    if (options.only) {
      source = pick(this.source, options.only)

    } else {
      source = clone(this.source)

    }

    if (options.skip) {
      for (const name of options.skip) {
        delete source[name]
      }
    }

    if (options.isUpdate) {
      for (const name in source) {
        delete source[name].required
        delete source[name].default
      }
    }

    if (options.skip) {
      for (const name of options.skip) {
        delete source[name]
      }
    }

    if (options.extend) {
      Object.assign(source, options.extend)
    }

    const schema = new this.constructor(name, source)
    schema.schemas = this.schemas

    return schema
  }

  extendWith(name, schema) {
    const source = clone(this.source)
    Object.assign(source, clone(schema.source))

    const newSchema   = new this.constructor(name, source)
    newSchema.schemas = this.schemas

    return newSchema
  }

  get jsonSchema() {
    let jsonSchema

    const isSchemaTypeDefined = !!this.source.type
    const isSchemaTypeObject  = this.source.type instanceof Object

    if (isSchemaTypeDefined && !isSchemaTypeObject) {
      jsonSchema = clone(this.source)

    } else {
      jsonSchema = {}
      const properties = clone(this.source)

      const required = []
      for (const name in properties) {
        if (properties[name].required) {
          required.push(name)
        }

        delete properties[name].required
      }

      jsonSchema.type       = 'object'
      jsonSchema.properties = properties

      if (required.length > 0) {
        jsonSchema.required = required
      }
    }

    jsonSchema.id = this.id
    return jsonSchema
  }

  set schemas(schemas) {
    this._schemas = schemas
  }

  get schemas() {
    const schemas = {}
    schemas[this.id] = this

    Object.assign(schemas, this._schemas || {})
    return schemas
  }

  get validator() {
    if (!this._validator) {
      this._validator = new ZSchema({ ignoreUnknownFormats: true })

      const schemas = []
      for (const id in this.schemas) {
        schemas.push(this.schemas[id].jsonSchema)
      }

      this._validator.validateSchema(schemas)
    }

    return this._validator
  }

  validate(object) {
    return new Promise((resolve, reject) => {
      this.validator.validate(object, this.jsonSchema, (errors, isValid) => {
        if (!isValid) {
          return reject(errors)
        }

        resolve()
      })
    })
  }

  updateDefaults(object) {
    this.constructor.updateDefaults(object, this.jsonSchema, this.schemas)
  }

  static updateDefaults(object, schema, schemas) {
    if (schema.properties) {
      for (const name in schema.properties) {

        if (!object[name] && schema.properties[name].default) {
          object[name] = schema.properties[name].default
        }

        if (!!object[name] && schema.properties[name].$ref) {
          const schemaName = schema.properties[name].$ref
          const jsonSchema = schemas[schemaName].jsonSchema

          this.updateDefaults(object[name], jsonSchema, schemas)
        }
      }
    }
  }

  static load(path, options = {}) {
    const sources = {}

    const fileNames = fs.readdirSync(path)
      .filter(fileName => fileName.indexOf('.yaml') > 0)

    for (const fileName of fileNames) {
      const name = fileName.replace('.yaml', '')
      sources[name] = yaml.safeLoad(fs.readFileSync(`${path}/${fileName}`))
    }

    const schemas = {}
    for (const name in sources) {
      schemas[name] = new Schema(name, sources[name])
    }

    const jsonSchemas = Object.values(schemas).map(schema => schema.jsonSchema)

    let { validatorOptions } = options
    validatorOptions = validatorOptions ? validatorOptions : { ignoreUnknownFormats: true }

    const validator = new ZSchema(validatorOptions)
    const isValid = validator.validateSchema(jsonSchemas)

    if (!isValid) {
      const validatorLastError = validator.getLastError()
      log.debug(validatorLastError)
      throw new Error('Schema validation failed')
    }

    for (const name in schemas) {
      schemas[name].schemas = schemas
    }

    return schemas
  }
}

module.exports = Schema

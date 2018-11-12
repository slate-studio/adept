'use strict'

const yaml  = require('js-yaml')
const fs    = require('fs')
const pick  = require('lodash.pick')
const clone = require('lodash.clonedeep')
const ZSchema     = require('z-schema')
const Promise     = require('bluebird')
const rootPath    = process.cwd()
const lowerCase   = require('lodash.lowercase')
const isUndefined = require('lodash.isundefined')

class Schema {
  static cleanup(object, schema, schemas) {
    if (schema.properties) {
      for (const name in object) {
        const isDefined = !!schema.properties[name]

        if (isDefined) {
          const isReference = !!schema.properties[name].$ref

          if (isReference) {
            const schemaName = schema.properties[name].$ref
            const jsonSchema = schemas[schemaName].jsonSchema

            this.cleanup(object[name], jsonSchema, schemas)
          }

        } else {
          delete object[name]

        }
      }
    }
  }

  static updateTypes(object, schema, schemas) {
    if (schema.properties) {
      for (const name in object) {
        const { type, $ref } = schema.properties[name]

        if (type) {
          const isNumber  = type == 'integer' || type == 'number'
          const isBoolean = type == 'boolean'

          if (isNumber) {
            object[name] = Number(object[name]) || object[name]
          }

          if (isBoolean) {
            let value = object[name]
            const isBoolean = typeof value == 'boolean'
            const isNumber  = typeof value == 'number'

            if (!isBoolean) {
              if (isNumber) {
                object[name] = Boolean(value)

              } else {
                const isTrue = lowerCase(value) == 'true' || value == '1'
                object[name] = isTrue ? true : false

              }
            }
          }
        }

        if ($ref) {
          const schemaName = schema.properties[name].$ref
          const jsonSchema = schemas[schemaName].jsonSchema

          this.updateTypes(object[name], jsonSchema, schemas)
        }
      }
    }
  }

  static updateDefaults(object, schema, schemas) {
    if (schema.properties) {
      for (const name in schema.properties) {
        const isValueDefined  = !isUndefined(object[name])
        const hasDefaultValue = !isUndefined(schema.properties[name].default)
        const isReference     = !isUndefined(schema.properties[name].$ref)

        if (!isValueDefined && hasDefaultValue) {
          object[name] = schema.properties[name].default
        }

        if (isValueDefined && isReference) {
          const schemaName = schema.properties[name].$ref
          const jsonSchema = schemas[schemaName].jsonSchema

          this.updateDefaults(object[name], jsonSchema, schemas)
        }
      }
    }
  }

  static load(path = `${rootPath}/app/schemas/`, options = {}) {
    const sources = {}
    const schemas = {}

    if (!fs.existsSync(path)) {
      return schemas
    }

    const fileNames = fs.readdirSync(path)
      .filter(fileName => fileName.indexOf('.yaml') > 0)

    for (const fileName of fileNames) {
      const name = fileName.replace('.yaml', '')
      sources[name] = yaml.safeLoad(fs.readFileSync(`${path}/${fileName}`))
    }

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
      throw validatorLastError
    }

    for (const name in schemas) {
      schemas[name].schemas = schemas
    }

    return schemas
  }

  constructor(id, source, schemas = {}) {
    this.id       = id
    this.source   = source
    this._schemas = schemas
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

  get jsonSchema() {
    let jsonSchema

    const isSourceTypeDefined = !!this.source.type
    const isSourceIncludesTypeField = this.source.type instanceof Object

    if (isSourceTypeDefined && !isSourceIncludesTypeField) {
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

  get validator() {
    if (!this._validator) {
      this.createValidator()
    }

    return this._validator
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

    if (options.extend) {
      Object.assign(source, options.extend)
    }

    return new this.constructor(name, source, this.schemas)
  }

  merge(name, schema) {
    const source = clone(this.source)
    Object.assign(source, clone(schema.source))

    return new this.constructor(name, source, this.schemas)
  }

  cleanup(object) {
    this.constructor.cleanup(object, this.jsonSchema, this.schemas)
  }

  updateTypes(object) {
    this.constructor.updateTypes(object, this.jsonSchema, this.schemas)
  }

  updateDefaults(object) {
    this.constructor.updateDefaults(object, this.jsonSchema, this.schemas)
  }

  createValidator() {
    this._validator = new ZSchema({ ignoreUnknownFormats: true })

    const schemas = []
    for (const id in this.schemas) {
      schemas.push(this.schemas[id].jsonSchema)
    }

    this._validator.validateSchema(schemas)
  }

  validate(object) {
    return new Promise((resolve, reject) => {
      this.validator.validate(object, this.jsonSchema, (errors, isValid) => {
        if (!isValid) {
          return reject(errors)
        }

        resolve(true)
      })
    })
  }
}

module.exports = Schema

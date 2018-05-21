'use strict'

const ZSchema = require('z-schema')
const Promise = require('bluebird')

class Validator {
  static get jsonSchema() {
    throw new Error(`'jsonSchema' is not defined for ${this.name}`)
  }

  static get references() {
    return {}
  }

  static get validator() {
    if (!this._validator) {
      const schemas = []
      for (const id in this.references) {
        schemas.push(this.references[id].jsonSchema)
      }

      schemas.push(this.jsonSchema)

      this._validator = new ZSchema(/* { strictMode: true } */)
      this._validator.validateSchema(schemas)
      // console.log(this._validator.lastReport.errors)
    }

    return this._validator
  }

  static async validate(json) {
    const schema = this.jsonSchema

    return new Promise((resolve, reject) => {
      this.validator.validate(json, schema, (err, isValid) => {
        if (err) {
          return reject(err)
        }

        return resolve(isValid)
      })
    })
  }
}

module.exports = Validator

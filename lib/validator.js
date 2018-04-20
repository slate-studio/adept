'use strict'

const ZSchema = require('z-schema')
const Promise = require('bluebird')

class Validator {
  static get spec() {
    throw new Error(`'spec' is not defined for ${this.name}`)
  }

  static get validator() {
    return new ZSchema() // { strictMode: true })
  }

  static async validate(json) {
    const schema = Object.assign({ id: this.id }, this.spec[this.id])

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

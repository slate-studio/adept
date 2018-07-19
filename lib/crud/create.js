'use strict'

const Operation = require('../operation')
const toLower  = require('lodash.tolower')

class Create extends Operation {
  static get description() {
    return `Create ${toLower(this.resourceName)}`
  }

  static get mutation() {
    return this.resource
  }

  static get responses() {
    return {
      'Created': {
        description: `${this.resourceName} created`,
        schema:      this.reference(this.output)
      }
    }
  }
}

module.exports = Create

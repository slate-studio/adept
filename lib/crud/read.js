'use strict'

const Query   = require('../query')
const toLower = require('lodash.tolower')

class Read extends Query {
  static get description() {
    return `Read ${toLower(this.resourceName)} by ID`
  }

  static get query() {
    return {
      id: {
        description: `${this.resourceName} ID`,
        type:        'string',
        required:    true
      }
    }
  }

  static get responses() {
    return {
      'OK': {
        schema: this.reference(this.output)
      },
      'Not Found': {
        description: `${this.resourceName} is not found`
      }
    }
  }
}

module.exports = Read

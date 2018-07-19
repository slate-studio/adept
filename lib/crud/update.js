'use strict'

const Operation = require('../operation')
const toLower   = require('lodash.tolower')

class Update extends Operation {
  static get description() {
    return `Update ${toLower(this.resourceName)} by ID`
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
        description: `${this.resourceName} updated`,
        schema:      this.reference(this.output)
      },
      'Not Found': {
        description: `${this.resourceName} is not found`
      }
    }
  }
}

module.exports = Update

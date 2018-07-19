'use strict'

const Operation = require('../operation')
const toLower  = require('lodash.tolower')

class Delete extends Operation {
  static get method() {
    return 'delete'
  }

  static get description() {
    return `Delete ${toLower(this.resourceName)} by ID`
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
      'No Content': {
        description: `${this.resourceName} deleted`
      },
      'Not Found': {
        description: `${this.resourceName} is not found`,
        schema:      this.operationError
      }
    }
  }
}

module.exports = Delete

'use strict'

const Resource = require('../resource')

class Delete extends Resource {
  static get method() {
    return 'delete'
  }

  static get description() {
    return `Delete ${this.resourceNameLowcase} by ID`
  }

  static get parameters() {
    return [
      {
        name:     'id',
        type:     'string',
        in:       'query',
        required: true
      }
    ]
  }

  static get responses() {
    return {
      'No Content': {
        description: `${this.resourceName} deleted`
      },
      'Not Found': {
        description: `${this.resourceName} is not found`,
        schema:      this.reference('OperationError')
      }
    }
  }
}

module.exports = Delete

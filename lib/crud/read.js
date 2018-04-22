'use strict'

const Query = require('../query')

class Read extends Query {
  static get description() {
    return `Read ${this.resourceNameLowcase} by ID`
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
      'OK': {
        schema: this.reference(this.output)
      },
      'Not Found': {
        description: `${this.resourceName} is not found`,
        schema:      this.reference('OperationError')
      }
    }
  }
}

module.exports = Read

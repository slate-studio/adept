'use strict'

const Mutation = require('../mutation')

class Create extends Mutation {
  static get description() {
    return `Create ${this.resourceNameLowcase}`
  }

  static get parameters() {
    return [
      {
        name:     this.resourceNameLowcase,
        in:       'body',
        schema:   this.reference(this.input),
        required: true
      }
    ]
  }

  static get responses() {
    return {
      'Created': {
        description: `${this.resourceName} created`,
        schema:      this.reference(this.output)
      },
      'Bad Request': {
        schema: this.reference('OperationError')
      },
      'Unprocessable Entity': {
        schema: this.reference('OperationError')
      }
    }
  }
}

module.exports = Create

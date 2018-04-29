'use strict'

const Mutation = require('../mutation')
const toLower  = require('lodash.tolower')

class Create extends Mutation {
  static get description() {
    return `Create ${toLower(this.resourceName)}`
  }

  static get parameters() {
    return [
      {
        name:     this.bodyParameterName,
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

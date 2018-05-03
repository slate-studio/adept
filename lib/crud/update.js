'use strict'

const Mutation = require('../mutation')
const toLower  = require('lodash.tolower')

class Update extends Mutation {
  static get method() {
    return 'patch'
  }

  static get description() {
    return `Update ${toLower(this.resourceName)} by ID`
  }

  static get parameters() {
    return [
      {
        name:     'id',
        type:     'string',
        in:       'query',
        required: true
      },
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
      'OK': {
        description: `${this.resourceName} updated`,
        schema:      this.reference(this.output)
      },
      'Bad Request': {
        schema: this.operationError
      },
      'Not Found': {
        description: `${this.resourceName} is not found`,
        schema:      this.operationError
      },
      'Unprocessable Entity': {
        schema: this.operationError
      }
    }
  }
}

module.exports = Update

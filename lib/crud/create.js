'use strict'

const Mutation = require('../mutation')
const toLower  = require('lodash.tolower')

class Create extends Mutation {
  static get description() {
    return `Create ${toLower(this.resourceName)}`
  }

  static get responses() {
    return {
      'Created': {
        description: `${this.resourceName} created`,
        schema:      this.reference(this.output)
      },
      'Bad Request':          {},
      'Unprocessable Entity': {}
    }
  }
}

module.exports = Create

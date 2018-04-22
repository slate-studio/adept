'use strict'

const { Definition } = require('../lib')
const toLower = require('lodash.tolower')

class Document extends Definition {
  static get schema() {
    return {
      id: {
        description: `${this.name} ID`,
        type:        'string',
        // format:      'uuid',
        required:    true
      },
      createdAt: {
        description: `Date and time when ${toLower(this.name)} was created`,
        type:        'string',
        format:      'date-time',
        required:    true
      },
      updatedAt: {
        description: `Date and time when ${toLower(this.name)} was updated`,
        type:        'string',
        format:      'date-time',
        required:    true
      },
      createdBy: {
        description: `ID of a user who created ${toLower(this.name)}`,
        type:        'string',
        // format:      'uuid',
        required:    true
      },
      updatedBy: {
        description: `ID of a user who updated ${toLower(this.name)}`,
        type:        'string',
        // format:      'uuid',
        required:    true
      }
    }
  }
}

module.exports = Document

'use strict'

const { Definition } = require('../lib')

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
        description: `Date and time when ${this.nameLowcase} was created`,
        type:        'string',
        format:      'date-time',
        required:    true
      },
      updatedAt: {
        description: `Date and time when ${this.nameLowcase} was updated`,
        type:        'string',
        format:      'date-time',
        required:    true
      },
      createdBy: {
        description: `ID of a user who created ${this.nameLowcase}`,
        type:        'string',
        // format:      'uuid',
        required:    true
      },
      updatedBy: {
        description: `ID of a user who updated ${this.nameLowcase}`,
        type:        'string',
        // format:      'uuid',
        required:    true
      }
    }
  }
}

module.exports = Document

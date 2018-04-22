'use strict'

const Query   = require('../query')
const toLower = require('lodash.tolower')

class Index extends Query {
  static get description() {
    return `Index ${toLower(this.collectionName)}`
  }

  static get parameters() {
    return [
      {
        name:        'page',
        description: 'Results page number',
        type:        'integer',
        format:      'int32',
        in:          'query',
        required:    true
      },
      {
        name:        'perPage',
        description: 'Results number per page',
        type:        'integer',
        format:      'int32',
        in:          'query',
        required:    true
      }
    ]
  }

  static get responses() {
    return {
      'OK': {
        schema: {
          type: 'array',
          items: this.reference(this.output)
        }
      }
    }
  }
}

module.exports = Index

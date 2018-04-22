'use strict'

const Query = require('../query')

class Index extends Query {
  static get description() {
    return `Index ${this.collectionNameLowcase}`
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

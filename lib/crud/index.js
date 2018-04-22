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
        },
        headers: {
          'X-Page': {
            description: 'Page number',
            schema: {
              type: 'number'
            }
          },
          'X-Per-Page': {
            description: `Number of ${toLower(this.collectionName)} per page`,
            schema: {
              type: 'number'
            }
          },
          'X-Pages-Count': {
            description: 'Total number of pages',
            schema: {
              type: 'number'
            }
          },
          'X-Total-Count': {
            description: `Total number of ${toLower(this.collectionName)}`,
            schema: {
              type: 'number'
            }
          }
        }
      }
    }
  }
}

module.exports = Index

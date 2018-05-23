'use strict'

const Query   = require('../query')
const toLower = require('lodash.tolower')

class Index extends Query {
  static get description() {
    return `Index ${toLower(this.collectionName)}`
  }

  static get defaultPerPage() {
    return 20
  }

  static get query() {
    return {
      page: {
        description: 'Results page number',
        type:        'integer',
        default:     1
      },
      perPage: {
        description: 'Results number per page',
        type:        'integer',
        default:     this.defaultPerPage
      }
    }
  }

  static get responses() {
    return {
      'OK': {
        schema: {
          type:  'array',
          items: this.reference(this.output)
        },
        headers: {
          'x-page': {
            description: 'Page number',
            type:        'integer'
          },
          'x-per-page': {
            description: `Number of ${toLower(this.collectionName)} per page`,
            type:        'integer'
          },
          'x-pages-count': {
            description: 'Total number of pages',
            type:        'integer'
          },
          'x-total-count': {
            description: `Total number of ${toLower(this.collectionName)}`,
            type:        'integer'
          }
        }
      },
      'Bad Request': {}
    }
  }
}

module.exports = Index

'use strict'

const Resource = require('./resource')

class Query extends Resource {
  static get responses() {
    return {
      'OK': {
        schema: this.reference(this.output)
      }
    }
  }
}

module.exports = Query

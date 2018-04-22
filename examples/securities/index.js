'use strict'

const Authorization = require('./authorization')
const Scope = require('./scope')

module.exports = {
  Authorization,
  Scope,
  security: [
    {
      Authorization: { klass: Authorization, options: [] },
      Scope:         { klass: Scope, options: [] }
    }
  ]
}

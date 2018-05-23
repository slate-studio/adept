'use strict'

const Shift = require('../examples/models/shift')
const Query = require('../lib/query')
const { expect } = require('chai')

describe('Query', () => {

  describe('Query.responses', () => {
    it('should return default responses', () => {
      class ReadShift extends Query {
        static get resource() {
          return Shift
        }
      }

      expect(ReadShift.responses).to.have.property('OK')
    })
  })

})

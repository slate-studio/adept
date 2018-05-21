'use strict'

const Shift = require('../examples/models/shift')
const Read  = require('../lib/crud/read')
const Query = require('../lib/query')
const { expect } = require('chai')

describe('Query', () => {

  describe('Query.spec', () => {
    it('should have method and output defined', () => {
      class ReadShift extends Read {
        static get resource() {
          return Shift
        }
      }

      expect(ReadShift.spec).to.have.property('/readShift')
      expect(ReadShift.spec['/readShift']).to.have.property('get')
    })
  })

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

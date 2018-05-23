'use strict'

const Unit = require('../examples/models/unit')
const Component  = require('../lib/component')
const { expect } = require('chai')

describe('Component', () => {

  describe('Component.schema', () => {
    it('should raise exception if schema method is not defined', () => {
      try {
        Component.schema

      } catch (error) {
        expect(error.message).to.equal('Component.schema is not defined')
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('Component.schemas', () => {
    it('should catch schemas', () => {
      Unit.schemas
    })
  })

})

'use strict'

const Unit = require('../examples/models/unit')
const Document   = require('../lib/document')
const { expect } = require('chai')

describe('Document', () => {

  describe('Document.constructor()', () => {
    it('should support no parameters', () => {
      new Unit()
    })
  })

  describe('Document.schema', () => {
    it('should raise exception if schema method is not defined', () => {
      try {
        Document.schema

      } catch (error) {
        expect(error.message).to.equal('Class method schema is not defined for Document')
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('Document.getSchema()', () => {
    it('should raise exception if schema method is not defined', () => {
      try {
        Document.getSchema('DefinitionName')

      } catch (error) {
        expect(error.message).to.equal('Class method getSchema is not defined for Document')
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('.id', () => {
    it('should return document id', () => {
      const unit = new Unit({ id: 'TEST_UNIT_ID' })
      expect(unit).to.have.property('id')
    })
  })

  describe('.toJSON()', () => {
    it('should return document attributes', () => {
      const unit = new Unit({ name: 'Demo Unit #1' })
      expect(unit.toJSON()).to.have.property('name')
    })
  })

})

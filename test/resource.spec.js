'use strict'

const UpdateUnit = require('../examples/units/updateUnit')
const Resource   = require('../lib/resource')
const { expect } = require('chai')

describe('Resource', () => {

  describe('Resource.resource', () => {
    it('should raise exception if resource is not defined', () => {
      class NoResource extends Resource {}

      try {
        NoResource.resource

      } catch (error) {
        expect(error.message).to.equal('\'resource\' is not defined for NoResource')
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('Resource.resourceName', () => {
    it('should be defined', () => {
      expect(UpdateUnit.resourceName).to.equal('Unit')
    })
  })

  describe('Resource.collectionName', () => {
    it('should be defined', () => {
      expect(UpdateUnit.collectionName).to.equal('Units')
    })
  })

})

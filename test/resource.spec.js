'use strict'

const UpdateUnit = require('../examples/units/updateUnit')
const Resource   = require('../lib/resource')
const { expect } = require('chai')

describe('Resource', () => {

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

  it('should have resourceName and collectionName defined', () => {
    expect(UpdateUnit.resourceName).to.equal('Unit')
    expect(UpdateUnit.collectionName).to.equal('Units')
  })

})

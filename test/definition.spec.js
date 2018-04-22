'use strict'

const UpdateUnitInput = require('../examples/units/updateUnitInput')
const Unit            = require('../examples/units/unit')
const Shift           = require('../examples/shifts/shift')
const Definition = require('../lib/definition')
const { expect } = require('chai')

describe('definition', () => {

  it('should raise exception if schema is not defined', () => {
    class NoSchema extends Definition {}

    try {
      NoSchema.spec

    } catch (error) {
      expect(error.message).to.equal('\'schema\' is not defined for NoSchema')
      return
    }

    throw new Error('Expected exception has not been raised')
  })

  it('should return references', async() => {
    expect(Shift.references.length).to.equal(1)
    expect(Unit.references.length).to.equal(0)

    UpdateUnitInput.reference('CrossReferenceDefinition')
    expect(UpdateUnitInput.references.length).to.equal(0)
  })

  it('should reformat required field into jsonSpec', async() => {
    expect(Unit.spec).to.have.property('Unit')
    expect(Unit.spec.Unit).to.have.property('type')
    expect(Unit.spec.Unit).to.have.property('properties')
    expect(Unit.spec.Unit).to.have.property('required')
  })

  it('should validate object against schema', async() => {
    await UpdateUnitInput.validate({ name: 'Unit #1' })
  })

})

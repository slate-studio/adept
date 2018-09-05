'use strict'

const api = require('examples/api')
const { Composer } = require('lib')
const { expect }   = require('chai')

describe('Compose', () => {

  describe('Compose.constructor()', () => {
    it('should build specification for modules', () => {
      const composer = new Composer({ modules: api })
      const { spec, operations } = composer

      // console.log(JSON.stringify(spec, null, 2)) // eslint-disable-line no-console

      expect(spec.securityDefinitions).to.have.property('Authorization')
      expect(spec.securityDefinitions).to.have.property('Scope')

      expect(spec.paths).to.have.property('/indexUnits')
      expect(spec.paths).to.have.property('/createUnit')
      expect(spec.paths).to.have.property('/updateUnit')
      expect(spec.paths).to.have.property('/readUnit')
      expect(spec.paths).to.have.property('/deleteUnit')
      expect(spec.paths).to.have.property('/indexShifts')

      expect(spec.definitions).to.have.property('Unit')
      expect(spec.definitions).to.have.property('CreateUnitInput')
      expect(spec.definitions).to.have.property('UpdateUnitInput')
      expect(spec.definitions).to.have.property('Shift')
      expect(spec.definitions).to.have.property('ShiftRequirement')

      expect(operations.length).to.equal(9)
    })
  })

})
'use strict'

const units = require('./units')
const { expect } = require('chai')

describe('lib', () => {

  describe('compose', () => {

    it('should build specification for modules', () => {
      const { Composer } = require('../lib')

      const modules  = [ units ]
      const composer = new Composer({ modules })
      const yaml = composer.yaml // eslint-disable-line no-unused-vars

      // console.log(yaml) // eslint-disable-line no-console
    })

  })

  describe('validator', () => {

    it('should validate object against schema', async() => {
      await units.UpdateUnitInput.validate({ name: 'Unit #1' })
    })

    it('should raise validation exception with errors', async() => {
      try {
        await units.Unit.validate({ name: 'Unit #1' })

      } catch (errors) {
        expect(errors.length).to.equal(17)

      }
    })

  })

})

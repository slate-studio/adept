'use strict'

const UpdateUnitInput = require('../examples/units/updateUnitInput')
const Unit       = require('../examples/models/unit')
const Validator  = require('../lib/validator')
const { expect } = require('chai')

describe('Validator', () => {

  describe('Validator.validate()', () => {
    it('should validate object against schema', async() => {
      class CustomValidator extends Validator {
        static get jsonSchema() {
          return UpdateUnitInput.jsonSchema
        }
      }

      await CustomValidator.validate({ name: 'Unit #1' })
    })

    it('should raise validation exception with errors', async() => {
      try {
        await Unit.validate({ name: 'Unit #1' })

      } catch (errors) {
        expect(errors.length).to.equal(16)

      }
    })
  })

  describe('Validator.validator', () => {
    it('should catch validator object', () => {
      UpdateUnitInput.validator
      UpdateUnitInput.validator
    })
  })

  describe('Validator.jsonSchema', () => {
    it('should raise exception if jsonSchema is not defined', async() => {
      try {
        Validator.jsonSchema

      } catch (error) {
        expect(error.message).to.equal('\'jsonSchema\' is not defined for Validator')

      }
    })
  })

})

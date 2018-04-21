'use strict'

const units = require('../examples/units')
const lib   = require('../lib')
const { expect } = require('chai')

describe('lib', () => {

  describe('compose', () => {

    it('should build specification for modules', () => {
      const modules  = [ units ]
      const composer = new lib.Composer({ modules })
      const spec     = composer.spec

      expect(spec.paths).to.have.property('/indexUnits')
      expect(spec.paths).to.have.property('/createUnit')
      expect(spec.paths).to.have.property('/updateUnit')
      expect(spec.paths).to.have.property('/readUnit')
      expect(spec.paths).to.have.property('/deleteUnit')


      expect(spec.definitions).to.have.property('Unit')
      expect(spec.definitions).to.have.property('CreateUnitInput')
      expect(spec.definitions).to.have.property('UpdateUnitInput')
    })

  })

  describe('definition', () => {

    it('should validate object against schema', async() => {
      await units.UpdateUnitInput.validate({ name: 'Unit #1' })
    })

    it('should raise exception if schema is not defined', async() => {
      try {
        lib.Definition.spec

      } catch (error) {
        expect(error.message).to.equal('\'schema\' is not defined for Definition')
        return
      }

      throw new Error('Expected exception has not been raised')
    })

  })

  describe('mutation', () => {

    it('should default to resouce when input not defined', async() => {
      class MoveUnit extends lib.Mutation {
        static get resource() {
          return units.Unit
        }
      }

      expect(MoveUnit.input.id).to.equal('Unit')
    })

  })

  describe('resource', () => {

    it('should raise exception if resource is not defined', async() => {
      try {
        lib.Query.output

      } catch (error) {
        expect(error.message).to.equal('Resource is not defined for Query')

      }
    })

  })

  describe('validator', () => {

    it('should validate object against schema', async() => {
      class CustomValidator extends lib.Validator {
        static get jsonSchema() {
          return units.UpdateUnitInput.jsonSchema
        }
      }

      await CustomValidator.validate({ name: 'Unit #1' })
    })

    it('should raise validation exception with errors', async() => {
      class CustomValidator extends lib.Validator {
        static get jsonSchema() {
          return units.Unit.jsonSchema
        }
      }

      try {
        await CustomValidator.validate({ name: 'Unit #1' })

      } catch (errors) {
        expect(errors.length).to.equal(17)

      }
    })

    it('should raise exception if jsonSchema is not defined', async() => {
      try {
        lib.Validator.jsonSchema

      } catch (error) {
        expect(error.message).to.equal('\'jsonSchema\' is not defined for Validator')

      }
    })

  })

})

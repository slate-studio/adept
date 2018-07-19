'use strict'

const Schema     = require('../lib/schema')
const { expect } = require('chai')
// const UpdateUnitInput = require('../examples/api/units/updateUnitInput')
// const CreateUnitInput = require('../examples/api/units/createUnitInput')
const { JobState }    = require('../examples/schemas')

describe('Schema', () => {

  // describe('Schema.load()', () => {
  //   it('should raise exception if schema validation fails', async() => {
  //     const load = () => Schema.load('examples/schemas', { validatorOptions: { strictMode: true }})
  //     expect(load).to.throw()
  //   })
  // })

  describe('.schemas', () => {
    it('should return empty hash if was not set', async() => {
      const schema = new Schema('Test', {})
      expect(Object.keys(schema.schemas).length).to.be.equal(1)
    })
  })

  // describe('.validate()', () => {
  //   it('should validate object', async() => {
  //     await UpdateUnitInput.schema.validate({ name: 'Unit #1' })
  //   })

  //   it('should raise exception if object is not valid', async() => {
  //     try {
  //       await CreateUnitInput.schema.validate({ name: 'Unit #1' })

  //     } catch (errors) {
  //       expect(errors.length).to.equal(5)
  //       return
  //     }

  //     throw new Error('Expected exception has not been raised')
  //   })
  // })

  describe('.updateDefaults()', () => {
    it('should ignore parent schemas of non-object type', async() => {
      const object = ''
      await JobState.updateDefaults(object)
    })
  })

})

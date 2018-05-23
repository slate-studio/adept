'use strict'

const { expect } = require('chai')
const Operation  = require('../lib/operation')
const UpdateUnit = require('../examples/api/units/updateUnit')
const ReadUnit   = require('../examples/api/units/readUnit')
const Trigger    = require('../examples/api/demo/trigger')

describe('Operation', () => {

  describe('Operation.responses', () => {
    it('should return default responses', async() => {
      expect(Operation.responses).to.have.property('OK')
    })
  })

  describe('Operation.references', () => {
    it('should return empty hash by default', async() => {
      expect(Operation.references).to.be.empty
    })
  })

  describe('Operation.parametersSchema', () => {
    it('should use empty source for scheme if query is missing', async() => {
      expect(Trigger.parametersSchema.source).to.be.empty
    })
  })

  describe('Operation.buildParameters', () => {
    it('should return undefined values if no parameters configuration', async() => {
      const { query, mutation } = Operation.buildParameters()
      expect(query).to.be.undefined
      expect(mutation).to.be.undefined
    })

    it('should return query and mutation objects with default values', async() => {
      const queryParameters    = { id: 'TEST_UNIT' }
      const mutationParameters = { name: 'Unit #1' }

      const { mutation } = await UpdateUnit
        .buildParameters(queryParameters, mutationParameters)

      expect(mutation).to.have.property('dayStartTime')
      expect(mutation).to.have.property('nightStartTime')
    })

    it('should raise exception if required parameter is missing in query', async() => {
      try {
        await ReadUnit.buildParameters({})

      } catch (error) {
        expect(error.originalError.errors.length).to.be.equal(1)
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('.status =', () => {
    it('should raise exception if status is not defined in responses', async() => {
      class NoStatusResponses extends Operation {
        static get responses() {
          return {
            'OK': {}
          }
        }
      }

      const handler = new NoStatusResponses()
      handler.status = 'OK'

      expect(handler.status).to.equal('OK')

      try {
        handler.status = 'No Content'

      } catch (error) {
        expect(error.message).to.equal('Response \'No Content\' is not defined for noStatusResponses')
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

})

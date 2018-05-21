'use strict'

const Security   = require('../lib/security')
const { expect } = require('chai')

describe('Security', () => {

  describe('Security.spec', () => {
    it('should raise exception if type is not defined', () => {
      class NoType extends Security {}

      try {
        NoType.spec

      } catch (error) {
        expect(error.message).to.equal('\'type\' is not defined for NoType')
        return
      }

      throw new Error('Expected exception has not been raised')
    })

    it('should raise exception if in is not defined', () => {
      class NoIn extends Security {
        static get type() {
          return 'apiKey'
        }
      }

      try {
        NoIn.spec

      } catch (error) {
        expect(error.message).to.equal('\'in\' is not defined for NoIn')
        return
      }

      throw new Error('Expected exception has not been raised')
    })

    it('should have spec', () => {
      class CustomSecurity extends Security {
        static get type() {
          return 'apiKey'
        }

        static get in() {
          return 'header'
        }
      }

      expect(CustomSecurity.spec).to.have.property('CustomSecurity')
      expect(CustomSecurity.spec.CustomSecurity).to.have.property('in')
      expect(CustomSecurity.spec.CustomSecurity).to.have.property('type')
    })
  })

})

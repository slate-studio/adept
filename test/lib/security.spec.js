'use strict'

const { expect }   = require('chai')
const { Security } = require('lib')

describe('Security', () => {

  describe('Security.in', () => {
    it('should throw exception if in is not defined', () => {
      expect(() => Security.in).to.throw('Security.in is not defined')
    })
  })

  describe('Security.type', () => {
    it('should throw exception if type is not defined', () => {
      expect(() => Security.type).to.throw('Security.type is not defined')
    })
  })

  describe('Security.spec', () => {
    it('should return security spec', () => {
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

'use strict'

const { Component, Schema } = require('../../lib')
const { expect } = require('chai')

describe('Component :: Abstract component class', () => {

  describe('Component.id', () => {
    it('should return name based on the class name', () => {
      expect(Component.id).to.equal('Component')
    })
  })

  describe('Component.schema', () => {
    it('should throw exception if schema is not defined', () => {
      expect(() => Component.schema).to.throw('Component.schema is not defined')
    })
  })

  describe('Component.schemas', () => {
    it('should return child schemas', async() => {
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schema() {
          return schemas.Profile
        }
      }

      expect(Profile.schemas).to.have.property('Profile')
      expect(Profile.schemas).to.have.property('Profile')
    })
  })

  describe('Component.references', () => {
    it('should return list of referenced schemas', async() => {
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schema() {
          return schemas.Profile
        }
      }

      expect(Profile.references).to.have.property('ProfileTag')
      expect(Profile.references).to.have.property('ProfileSex')
      expect(Profile.references).to.have.property('ProfileParameters')
    })
  })

  describe('Component.resolveReferences(schema)', () => {
    it('should do nothing if schema is not defined', async() => {
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schema() {
          return schemas.Profile
        }
      }

      expect(Profile.resolveReferences()).to.be.undefined
    })
  })
})

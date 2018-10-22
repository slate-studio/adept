'use strict'

const { Component, Schema } = require('lib')
const { expect } = require('chai')

describe('Component :: Abstract component class', () => {

  describe('Component.id', () => {
    it('should return name based on the class name', () => {
      expect(Component.id).to.equal('Component')
    })
  })

  describe('Component.schemas', () => {
    it('should return preloaded schemas from app/schemas/', async() => {
      expect(Component.schemas).to.be.empty
    })
  })

  describe('Component.references', () => {
    it('should return list of referenced schemas', async() => {
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schemas() {
          return schemas
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

  describe('Component.isComponent(object)', () => {
    it('returns `false` if object does not have `id`, `schema` or `reference` fields', async() => {
      expect(Component.isComponent({})).to.be.false
      expect(Component.isComponent({ id: 'TEST' })).to.be.false
      expect(Component.isComponent({ id: 'TEST', schema: {} })).to.be.false
    })
  })
})

'use strict'

const Shift  = require('../examples/models/shift')
const Update = require('../lib/crud/update')
const { expect } = require('chai')

describe('Mutation', () => {

  describe('Mutation.mutation', () => {
    it('should return resource by default', () => {
      class UpdateShift extends Update {
        static get resource() {
          return Shift
        }
      }

      expect(UpdateShift.mutation.id).to.be.equal('Shift')
    })
  })

})

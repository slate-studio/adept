'use strict'

const Shift  = require('../examples/shifts/shift')
const Update = require('../lib/crud/update')
const { expect } = require('chai')

describe('Mutation', () => {

  it('should have method, input and output defined', () => {
    class UpdateShift extends Update {
      static get resource() {
        return Shift
      }
    }

    expect(UpdateShift.spec).to.have.property('/updateShift')
    expect(UpdateShift.spec['/updateShift']).to.have.property('patch')
  })

})

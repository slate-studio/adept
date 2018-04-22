'use strict'

const Shift = require('../examples/shifts/shift')
const Read  = require('../lib/crud/read')
const { expect } = require('chai')

describe('query', () => {

  it('should have method and output defined', () => {
    class ReadShift extends Read {
      static get resource() {
        return Shift
      }
    }

    expect(ReadShift.spec).to.have.property('/readShift')
    expect(ReadShift.spec['/readShift']).to.have.property('get')
  })

})

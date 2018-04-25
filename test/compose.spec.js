'use strict'

const units      = require('../examples/units')
const shifts     = require('../examples/shifts')
const Composer   = require('../lib/composer')
const { expect } = require('chai')

describe('Compose', () => {

  it('should build specification for modules', () => {
    const modules  = [ units, shifts ]
    const composer = new Composer({ modules })
    const { spec, operations } = composer

    // console.log(JSON.stringify(spec, null, 2)) // eslint-disable-line no-console

    expect(spec.securityDefinitions).to.have.property('Authorization')
    expect(spec.securityDefinitions).to.have.property('Scope')

    expect(spec.paths).to.have.property('/indexUnits')
    expect(spec.paths).to.have.property('/createUnit')
    expect(spec.paths).to.have.property('/updateUnit')
    expect(spec.paths).to.have.property('/readUnit')
    expect(spec.paths).to.have.property('/deleteUnit')
    expect(spec.paths).to.have.property('/indexShifts')

    expect(spec.definitions).to.have.property('Unit')
    expect(spec.definitions).to.have.property('CreateUnitInput')
    expect(spec.definitions).to.have.property('UpdateUnitInput')
    expect(spec.definitions).to.have.property('Shift')
    expect(spec.definitions).to.have.property('ShiftRequirement')

    expect(operations.length).to.equal(6)
  })

})

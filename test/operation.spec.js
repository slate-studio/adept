'use strict'

const Operation  = require('../lib/operation')
const Definition = require('../lib/definition')
const { expect } = require('chai')

class FacilityUser extends Definition {}

class ReadFacilityUser extends Operation {
  static get method() {
    return 'get'
  }

  static get responses() {
    return {
      'OK': {
        schema: this.reference(FacilityUser)
      },
      'Not Found': {
        description: 'Facility user is not found'
      }
    }
  }
}

describe('operation', () => {

  it('should raise exception if responses are not defined', async() => {
    class NoResponses extends Operation {}

    try {
      NoResponses.spec

    } catch (error) {
      expect(error.message).to.equal('\'responses\' are not defined for NoResponses')
      return
    }

    throw new Error('Expected exception has not been raised')
  })

  it('should raise exception if method is not defined', async() => {
    class NoMethod extends Operation {
      static get responses() {
        return {
          'OK': {}
        }
      }
    }

    try {
      NoMethod.spec

    } catch (error) {
      expect(error.message).to.equal('\'method\' is not defined for NoMethod')
      return
    }

    throw new Error('Expected exception has not been raised')
  })

  it('should return empty array if no references', async() => {
    class NoReferences extends Operation {
      static get method() {
        return 'get'
      }

      static get responses() {
        return {
          'OK': {}
        }
      }
    }

    const { references } = NoReferences
    expect(references).to.be.empty
  })

  it('should build spec', async() => {
    ReadFacilityUser.reference('BadRequestError')
    const { spec, references } = ReadFacilityUser

    expect(spec).to.have.property('/readFacilityUser')
    expect(spec['/readFacilityUser']).to.have.property('get')
    expect(spec['/readFacilityUser'].get.operationId).to.equal('readFacilityUser')
    expect(spec['/readFacilityUser'].get.responses).to.have.property('200')
    expect(spec['/readFacilityUser'].get.responses['200'].description).to.equal('OK')
    expect(references).to.be.not.empty
  })

})

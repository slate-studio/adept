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

describe('Operation', () => {

  it('should return default responses', async() => {
    class NoResponses extends Operation {}
    expect(NoResponses.spec['/noResponses'].get.responses).to.have.property('200')
  })

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
      expect(error.message).to.equal('Reponse \'No Content\' is not defined for noStatusResponses')
      return
    }

    throw new Error('Expected exception has not been raised')
  })

  it('should raise exception if method is not defined', async() => {
    class NoMethod extends Operation {}
    expect(NoMethod.spec['/noMethod']).to.have.property('get')
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

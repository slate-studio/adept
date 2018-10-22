'use strict'

const { expect } = require('chai')
const { Operation, Schema, Component }  = require('lib')

let schemas, Profile

describe('Operation :: Abstract operation class', () => {

  before(async() => {
    schemas = await Schema.load('test/lib/schemas')

    Profile = class extends Component {
      static get schemas() {
        return schemas
      }
    }
  })

  describe('Operation.id', () => {
    it('should return name based on the class name', () => {
      expect(Operation.id).to.equal('Operation')
    })
  })

  describe('Operation.type', () => {
    it('returns type', () => {
      expect(Operation.type).to.equal('READ')
    })
  })

  describe('Operation.types', () => {
    it('returns object with supported types', () => {
      const keys = Object.keys(Operation.types)
      expect(keys).to.deep.equal([ 'CREATE', 'READ', 'UPDATE', 'DELETE' ])
    })
  })

  describe('Operation.tags', () => {
    it('should return empty list', () => {
      expect(Operation.tags).to.be.empty
    })
  })

  describe('Operation.summary', () => {
    it('should return summary based on operationId', () => {
      expect(Operation.summary).to.equal('Operation')
    })
  })

  describe('Operation.description', () => {
    it('should return empty string', () => {
      expect(Operation.description).to.be.empty
    })
  })

  describe('Operation.security', () => {
    it('should return empty list', () => {
      expect(Operation.security).to.be.empty
    })
  })

  describe('Operation.resource', () => {
    it('returns `null` by default', () => {
      expect(Operation.resource).to.be.null
    })
  })

  describe('Operation.output', () => {
    it('returns `null` by default', () => {
      expect(Operation.output).to.be.null
    })
  })

  describe('Operation.resultSchema', () => {
    it('throws exception when output is not defined', () => {
      expect(() => Operation.resultSchema).to.throw('Operation.output is not defined')
    })

    it('should return output schema by default', () => {
      class IndexProfiles extends Operation {
        static get resource() {
          return Profile
        }
      }

      expect(IndexProfiles.resultSchema).to.have.property('id', 'Profile')
    })
  })

  describe('Operation.resourceName', () => {
    it('should throw exception when resource is not defined', () => {
      expect(() => Operation.resourceName).to.throw('Operation.resource is not defined')
    })

    it('should return resource name', () => {
      class Orange {
      }

      class IndexOranges extends Operation {
        static get resource() {
          return Orange
        }
      }

      expect(IndexOranges.resourceName).to.equal('Orange')
    })
  })

  describe('Operation.collectionName', () => {
    it('should throw exception when resource is not defined', () => {
      expect(() => Operation.collectionName).to.throw('Operation.resource is not defined')
    })

    it('should return resource collection name', () => {
      class Orange {
      }

      class IndexOranges extends Operation {
        static get resource() {
          return Orange
        }
      }

      expect(IndexOranges.collectionName).to.equal('Oranges')
    })
  })

  describe('Operation.reference(component)', () => {
    it('should attache object reference and return $ref', async() => {
      class ProfileOperation extends Operation {
      }

      expect(ProfileOperation.reference(Profile)).to.have.property('$ref')
    })
  })

  describe('Operation.references', () => {
    it('should return empty hash', () => {
      expect(Operation.references).to.be.empty
    })

    it('should return operation references', async() => {
      class CreateProfile extends Operation {
        static get mutation() {
          return Profile
        }
      }

      expect(CreateProfile.references).to.have.property('Profile')
    })
  })

  describe('Operation.defaultError', () => {
    it('should return OperationError', () => {
      expect(Operation.defaultError).to.equal('OperationError')
    })
  })

  describe('Operation.inputSchema', () => {
    it('should return schema with id and empty source', () => {
      expect(Operation.inputSchema).to.have.property('id')
      expect(Operation.inputSchema).to.have.property('source')
      expect(Operation.inputSchema.source).to.be.empty
    })

    it('should return schema build from query and mutation schemas', async() => {
      class CreateProfile extends Operation {
        static get mutation() {
          return Profile
        }
      }

      expect(CreateProfile.inputSchema).have.property('id')
    })
  })

  describe('Operation.isOperation(object)', () => {
    it('returns `false` if object does not have `id` or `type` fields', async() => {
      expect(Operation.isOperation({})).to.be.false
      expect(Operation.isOperation({ id: 'TEST' })).to.be.false
      expect(Operation.isOperation({ id: 'TEST', type: 'READ' })).to.be.true
    })
  })

  describe('Operation.buildValidators()', () => {
    it('builds validators and validates all related schemas', async() => {
      class CreateProfile extends Operation {
        static get resource() {
          return Profile
        }

        static get mutation() {
          return Profile
        }
      }

      class DeleteProfile extends Operation {
        static get type() {
          return Operation.types.DELETE
        }

        static get query() {
          return {
            id: { type: 'string', required: true }
          }
        }

        static get resource() {
          return Profile
        }

        static get output() {
          return null
        }
      }

      CreateProfile.buildValidators()
      DeleteProfile.buildValidators()
    })
  })
})

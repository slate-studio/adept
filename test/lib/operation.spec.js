'use strict'

const { expect } = require('chai')
const { Operation, Schema, Component }  = require('../../lib')

describe('Operation :: Abstract operation class', () => {

  describe('Operation.id', () => {
    it('should return name based on the class name', () => {
      expect(Operation.id).to.equal('operation')
    })
  })

  describe('Operation.tags', () => {
    it('should return empty list', () => {
      expect(Operation.tags).to.be.empty
    })
  })

  describe('Operation.path', () => {
    it('should return path based on operationId', () => {
      expect(Operation.path).to.equal('/operation')
    })
  })

  describe('Operation.method', () => {
    it('should return GET method', () => {
      expect(Operation.method).to.equal('get')
    })

    it('should return PATCH method when mutation is defined', () => {
      class Mutation extends Operation {
        static get mutation() {
          return {}
        }
      }
      expect(Mutation.method).to.equal('patch')
    })

    it('should return POST method when create mutation is defined', () => {
      class CreateMutation extends Operation {
        static get mutation() {
          return {}
        }

        static get responses() {
          return {
            Created: {}
          }
        }
      }
      expect(CreateMutation.method).to.equal('post')
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
    it('should return null', () => {
      expect(Operation.resource).to.be.null
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

  describe('Operation.responses', () => {
    it('should return OK response with no schema', () => {
      expect(Operation.responses).to.have.property('OK')
      expect(Operation.responses.OK).to.be.empty
    })

    it('should return OK response with output schema', () => {
      class ReadApple extends Operation {
        static get output() {
          return 'Apple'
        }
      }

      expect(ReadApple.responses).to.have.property('OK')
      expect(ReadApple.responses.OK).to.have.property('schema')
      expect(ReadApple.responses.OK.schema).to.have.property('$ref')
    })
  })

  describe('Operation.reference', () => {
    it('should attache object reference and return $ref', async() => {
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schema() {
          return schemas.Profile
        }
      }

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
      const schemas = await Schema.load('test/lib/schemas')

      class Profile extends Component {
        static get schema() {
          return schemas.Profile
        }
      }

      class CreateProfile extends Operation {
        static get mutation() {
          return Profile
        }
      }

      expect(CreateProfile.references).to.have.property('Profile')
    })
  })

  describe('Operation.operationError', () => {
    it('should return reference to OperationError', () => {
      expect(Operation.operationError).to.have.property('$ref')
    })
  })

  describe('Operation.parametersSchema', () => {
    it('should return schema with id and empty source', () => {
      expect(Operation.parametersSchema).to.have.property('id')
      expect(Operation.parametersSchema).to.have.property('source')
      expect(Operation.parametersSchema.source).to.be.empty
    })

    it('should return schema build from query and mutation schemas', () => {
    })
  })

  // describe('Operation.parametersSchema', () => {
  //   it('should use empty source for scheme if query is missing', () => {
  //     expect(Trigger.parametersSchema.source).to.be.empty
  //   })
  // })

  // describe('Operation.buildParameters', () => {
  //   it('should return undefined values if no parameters configuration', () => {
  //     const { query, mutation } = Operation.buildParameters()
  //     expect(query).to.be.undefined
  //     expect(mutation).to.be.undefined
  //   })

  //   // it('should return query and mutation objects with default values', () => {
  //   //   const queryParameters    = { id: 'TEST_UNIT' }
  //   //   const mutationParameters = { name: 'Unit #1' }

  //   //   const { mutation } = await UpdateUnit
  //   //     .buildParameters(queryParameters, mutationParameters)

  //   //   expect(mutation).to.have.property('dayStartTime')
  //   //   expect(mutation).to.have.property('nightStartTime')
  //   // })

  //   // it('should raise exception if required parameter is missing in query', () => {
  //   //   try {
  //   //     await ReadUnit.buildParameters({})

  //   //   } catch (error) {
  //   //     expect(error.originalError.errors.length).to.be.equal(1)
  //   //     return
  //   //   }

  //   //   throw new Error('Expected exception has not been raised')
  //   // })
  // })

  // describe('.status =', () => {
  //   it('should raise exception if status is not defined in responses', () => {
  //     class NoStatusResponses extends Operation {
  //       static get responses() {
  //         return {
  //           'OK': {}
  //         }
  //       }
  //     }

  //     const handler = new NoStatusResponses()
  //     handler.status = 'OK'

  //     expect(handler.status).to.equal('OK')

  //     try {
  //       handler.status = 'No Content'

  //     } catch (error) {
  //       expect(error.message).to.equal('Response \'No Content\' is not defined for noStatusResponses')
  //       return
  //     }

  //     throw new Error('Expected exception has not been raised')
  //   })
  // })

})

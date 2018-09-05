'use strict'

const { expect } = require('chai')
const { Schema, Document } = require('lib')

describe('Document', () => {

  describe('Document.constructor(attributes = {})', () => {
    it('should assign attributes to the instance', () => {
      const doc1 = new Document({ data: 'test' })
      expect(doc1.attributes.data).to.equal('test')

      const doc2 = new Document()
      expect(doc2.attributes).to.be.empty
    })
  })

  describe('Document.getSchema(name)', () => {
    it('should throw exception if getSchema method is not defined', () => {
      class Book extends Document {}

      expect(() => Book.getSchema('Author')).to
        .throw('Book.getSchema(name) is not defined, requested schema name: Author')
    })
  })

  describe('Document.commonSchema', () => {
    it('should return common schema for documents', () => {
      const schemas = {
        Common: new Schema('Common', {
          createdAt: { type: 'string', format: 'date-time' }
        })
      }

      class Book extends Document {
        static getSchema(name) {
          return schemas[name]
        }
      }

      expect(Book.commonSchema.id).to.be.equal('Common')
    })
  })

  describe('Document.documentSchema', () => {
    it('should return partial schema for document', () => {
      const schemas = {
        Common: new Schema('Common', {
          createdAt: { type: 'string', format: 'date-time' }
        }),
        Book: new Schema('Book', {
          author: { type: 'string' }
        })
      }

      class Book extends Document {
        static getSchema(name) {
          return schemas[name]
        }
      }

      expect(Book.documentSchema.id).to.be.equal('Book')
    })
  })

  describe('Document.schema', () => {
    it('should return schema', () => {
      // TODO: Check case when source is JSON schema, merge in this case doesn't
      //       work correctly.
      const schemas = {
        Common: new Schema('Common', {
          createdAt: { type: 'string', format: 'date-time' }
        }),
        Book: new Schema('Book', {
          author: { type: 'string' }
        })
      }

      class Book extends Document {
        static getSchema(name) {
          return schemas[name]
        }
      }

      expect(Book.schema.source).to.have.property('author')
      expect(Book.schema.source).to.have.property('createdAt')
    })
  })

  describe('.toJSON()', () => {
    it('should return document attributes', () => {
      const doc = new Document({ name: 'Demo' })
      expect(doc.toJSON()).to.have.property('name')
    })
  })

  describe('.id', () => {
    it('should return document id', () => {
      const doc = new Document({ id: 'DEMO' })
      expect(doc).to.have.property('id')
    })
  })

})

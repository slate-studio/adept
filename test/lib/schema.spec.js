'use strict'

const ZSchema    = require('z-schema')
const { Schema } = require('lib')
const { expect } = require('chai')

describe('Schema', () => {

  const profileSexSchema = new Schema('ProfileSex', {
    type: 'string',
    enum: [ 'Male', 'Female' ]
  })

  const profileParametersSchema = new Schema('ProfileParameters', {
    shoeSize:  { type: 'number', default: 42 },
    shirtSize: { type: 'string', default: 'M' },
    isValid:   { type: 'boolean', default: true }
  })

  const profileSchema = new Schema('Profile', {
    firstName: { type: 'string', default: 'Alexander' },
    lastName:  { type: 'string', default: 'Kravets' },
    age:       { type: 'number' },
    sex:       {
      $ref: 'ProfileSex'
    },
    parameters: {
      $ref: 'ProfileParameters'
    },
    isActive: {
      type:    'boolean',
      default: false
    }
  })

  profileSchema.schemas = {
    ProfileSex:        profileSexSchema,
    ProfileParameters: profileParametersSchema
  }

  describe('Schema.constructor(id, source)', () => {
    it('should initialize schema with id and source', () => {
      const schema = new Schema('Test', {})
      expect(schema.id).to.be.equal('Test')
      expect(schema.source).to.be.empty
    })
  })

  describe('.clone(id, options)', () => {
    it('should return new schema with specified id', () => {
      const schema1 = new Schema('Test1', { example: { type: 'string' } })
      const schema2 = schema1.clone('Test2')

      expect(schema2.id).to.be.equal('Test2')
      expect(schema2.source).to.be.not.empty
    })

    describe('only', () => {
      it('should return schema with only specified fields', () => {
        const schema1 = new Schema('Test1', {
          firstName: { type: 'string' },
          lastName:  { type: 'string' }
        })

        const schema2 = schema1.clone('Test2', { only: [ 'firstName' ] })

        expect(schema2.source).to.have.property('firstName')
        expect(schema2.source).to.not.have.property('lastName')
      })
    })

    describe('skip', () => {
      it('should return schema without specified fields', () => {
        const schema1 = new Schema('Test1', {
          firstName: { type: 'string' },
          lastName:  { type: 'string' }
        })

        const schema2 = schema1.clone('Test2', { skip: [ 'firstName' ] })

        expect(schema2.source).to.have.property('lastName')
        expect(schema2.source).to.not.have.property('firstName')
      })
    })

    describe('isUpdate', () => {
      it('should return schema wihout required attribute and no defaults', () => {
        const schema1 = new Schema('Test1', {
          firstName: {
            type:     'string',
            default:  'Bob',
            required: true
          }
        })

        const schema2 = schema1.clone('Test2', { isUpdate: true })

        expect(schema2.source.firstName).to.not.have.property('required')
        expect(schema2.source.firstName).to.not.have.property('default')
      })
    })

    describe('extend', () => {
      it('should return schema with additional specified fields', () => {
        const schema1 = new Schema('Test1', {
          firstName: { type: 'string' }
        })

        const schema2 = schema1.clone('Test2', {
          extend: {
            lastName: { type: 'string' }
          }
        })

        expect(schema2.source).to.have.property('lastName')
        expect(schema2.source).to.have.property('firstName')
      })
    })
  })

  describe('.merge(id, schema)', () => {
    it('should return new schema with specified id and merged source', () => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' }
      })

      const schema2 = new Schema('Test2', {
        lastName: { type: 'string' }
      })

      const schema3 = schema1.merge('Test3', schema2)

      expect(schema3.id).to.be.equal('Test3')
      expect(schema3.source).to.have.property('lastName')
      expect(schema3.source).to.have.property('firstName')
    })
  })

  describe('.jsonSchema', () => {
    it('should return json schema', () => {
      const schema = new Schema('Test', {
        firstName: { type: 'string' },
        lastName:  { type: 'string', required: true },
      })

      expect(schema.jsonSchema).to.have.property('id')
      expect(schema.jsonSchema).to.have.property('type')
      expect(schema.jsonSchema).to.have.property('properties')
      expect(schema.jsonSchema).to.have.property('required')
    })

    it('should return json schema without required fields', () => {
      const schema = new Schema('Test', {
        firstName: { type: 'string' }
      })

      expect(schema.jsonSchema).to.not.have.property('required')
    })

    it('should return json schema with overriden id when source is a json schema', () => {
      const schema = new Schema('Test', {
        type:       'object',
        properties: {
          firstName: { type: 'string' }
        }
      })

      expect(schema.jsonSchema).to.have.property('id')
      expect(schema.jsonSchema).to.have.property('type')
      expect(schema.jsonSchema).to.have.property('properties')
    })
  })

  describe('.schemas', () => {
    it('should return related schemas map', () => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' }
      })

      expect(schema1.schemas).to.have.property('Test1')
    })
  })

  describe('.schemas = {}', () => {
    it('should allow to extend related schemas map', () => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' }
      })

      const schema2 = schema1.clone('Test2', {
        lastName: { type: 'string' }
      })

      schema1.schemas = { 'Test2': schema2 }
      expect(schema1.schemas).to.have.property('Test1')
      expect(schema1.schemas).to.have.property('Test2')
    })
  })

  describe('.validator', () => {
    it('should return schema validator by building it only once', () => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' }
      })

      const { validator } = schema1
      expect(validator).to.be.instanceof(ZSchema)
      expect(schema1.validator).to.equal(validator)
    })
  })

  describe('.validate', () => {
    it('should return success if parameters are valid', async() => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' },
        lastName:  { type: 'string', required: true }
      })

      const isValid = await schema1.validate({
        firstName: 'Alexander',
        lastName:  'Kravets'
      })

      expect(isValid).to.true
    })

    it('should throw exception with errors if parameters are not valid', async() => {
      const schema1 = new Schema('Test1', {
        firstName: { type: 'string' },
        lastName:  { type: 'string', required: true }
      })

      try {
        await schema1.validate({ firstName: 'Alexander' })

      } catch (errors) {
        expect(errors.length).to.equal(1)
        return
      }

      throw new Error('Expected exception has not been raised')
    })
  })

  describe('.updateDefaults(object)', () => {
    it('should update object with schemas defaults', async() => {
      const object = { parameters: {} }
      profileSchema.updateDefaults(object)

      expect(object.firstName).to.equal('Alexander')
      expect(object.lastName).to.equal('Kravets')
      expect(object.isActive).to.equal(false)
      expect(object.parameters.shoeSize).to.equal(42)
      expect(object.parameters.shirtSize).to.equal('M')

      profileSexSchema.updateDefaults('')
    })
  })

  describe('.updateTypes(object)', () => {
    it('should normalize objects value types according to schema', async() => {
      let object

      object = { shoeSize: '40' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ shoeSize: 40 })

      object = { shoeSize: 'NaN' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ shoeSize: 'NaN' })

      object = { isValid: '0' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: false })

      object = { isValid: 'false' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: false })

      object = { isValid: '1' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: true })

      object = { isValid: 'true' }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: true })

      object = { isValid: true }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: true })

      object = { isValid: 1 }
      profileParametersSchema.updateTypes(object)
      expect(object).to.include({ isValid: true })

      profileSexSchema.updateTypes({ data: 'OK' })
    })
  })

  describe('.cleanup(object)', () => {
    it('should remove fields not defined in schema', async() => {
      let object

      object = {
        lastName:   'Alexander',
        sex:        'Male',
        hair:       'Dark',
        parameters: {
          shoeSize:  42,
          isSmoking: false
        }
      }

      profileSchema.cleanup(object)
      expect(object).to.deep.equal({
        lastName:   'Alexander',
        sex:        'Male',
        parameters: {
          shoeSize: 42
        }
      })
    })
  })

  describe('Schema.load(path, options)', () => {
    it('should return schemas map', async() => {
      const schemas = await Schema.load('test/lib/schemas')
      expect(schemas).to.have.property('Profile')
      expect(schemas).to.have.property('ProfileSex')
      expect(schemas).to.have.property('ProfileParameters')
    })

    it('should thow exeception if schemas are not valid', async() => {
      const options = { validatorOptions: { strictMode: true } }
      const load = () => Schema.load('test/lib/schemas', options)
      expect(load).to.throw()
    })
  })
})

'use strict'

const Document = require('../document')
const ShiftRequirement = require('./shiftRequirement')

class Shift extends Document {
  static get schema() {
    const schema = Object.assign({}, super.schema)
    return Object.assign(schema, this.entitySchema)
  }

  static get entitySchema() {
    return {
      unitId: {
        description: '',
        type:        'string'
      },
      grouId: {
        description: '',
        type:        'string'
      },
      name: {
        description: '',
        type:        'string'
      },
      startTime: {
        description: '',
        type:        'string'
      },
      length: {
        description: '',
        type:        'number'
      },
      isChargeStaffRequired: {
        description: '',
        type:        'boolean',
        default:     false
      },
      isHidden: {
        description: '',
        type:        'boolean',
        default:     false
      },
      requirements: {
        description: '',
        type:        'array',
        items:       this.reference(ShiftRequirement)
      }
    }
  }
}

module.exports = Shift

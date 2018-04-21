'use strict'

const { Document } = require('../../lib')

class Unit extends Document {
  static get schema() {
    const schema = Object.assign({}, super.schema)
    return Object.assign(schema, this.entitySchema)
  }

  static get entitySchema() {
    return {
      state: {
        description: `State where ${this.nameLowcasePlural} facility is located`,
        type:        'string',
        required:    true
      },
      name: {
        description: `${this.name} name`,
        type:        'string',
        required:    true
      },
      beds: {
        description: `Number of beds in ${this.nameLowcase}`,
        type:        'number',
        min:         1,
        required:    true
      },
      staffingPeriod: {
        description: `${this.name} staffing period in weeks`,
        type:        'number',
        min:         1,
        required:    true
      },
      minimumStaffingRequirementId: {
        description: 'Minimum staffing requirements ID',
        type:        'string',
        required:    true
      },
      minimumStaffingRequirement: {
        description: `${this.name} minimum staffing requirements cached object`,
        type:        'object',
        required:    true
      },
      hppdTarget: {
        description: `Hours per patient day target value for ${this.nameLowcasePlural}`,
        type:        'number',
        required:    true
      },
      schedulingStartsAt: {
        description: `Date and time when scheduling starts in a new ${this.nameLowcase}`,
        type:        'string',
        format:      'date-time',
        required:    true
      },
      dayStartTime: {
        description: `Time when morning shifts do start in a ${this.nameLowcase}`,
        type:        'string',
        example:     '06:00',
        required:    true
      },
      nightStartTime: {
        description: `Time when night shifts do start in a ${this.nameLowcase}`,
        type:        'string',
        example:     '20:00',
        required:    true
      },
      requiredSkillsIds: {
        description: `IDs of staff skills required to work in a ${this.nameLowcase}`,
        type:        'array',
        default:     [],
        required:    true
      },
      requiredCertificationsCredentials: {
        description: `Staff certification credentials required to work in a ${this.nameLowcase}`,
        type:        'array',
        default:     [],
        required:    true
      },
      noteSubjectOptions: {
        description: `Subject options for ${this.nameLowcase} notes`,
        type:        'array',
        default:     [],
        required:    true
      }
    }
  }
}

module.exports = Unit

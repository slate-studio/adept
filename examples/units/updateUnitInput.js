'use strict'

const pick = require('lodash.pick')
const Unit = require('./unit')
const { Definition } = require('../../lib')

class UpdateUnitInput extends Definition {
  static get schema() {
    const schema = pick(Unit.schema, [
      'state',
      'name',
      'beds',
      'staffingPeriod',
      'minimumStaffingRequirementId',
      'hppdTarget',
      'schedulingStartsAt',
      'dayStartTime',
      'nightStartTime',
    ])

    for (const name in schema) {
      delete schema[name].required
    }

    return schema
  }
}

module.exports = UpdateUnitInput

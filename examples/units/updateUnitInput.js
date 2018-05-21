'use strict'

const pick = require('lodash.pick')
const Unit = require('../models/unit')
const { Definition } = require('../../lib')

class UpdateUnitInput extends Definition {
  static get schema() {
    const schema = pick(Unit.documentSchema, [
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

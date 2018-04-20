'use strict'

const pick = require('lodash.pick')
const Unit = require('./unit')
const { Definition } = require('../../lib')

class CreateUnitInput extends Definition {
  static get schema() {
    return pick(Unit.schema, [
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
  }
}

module.exports = CreateUnitInput

'use strict'

const pick = require('lodash.pick')
const Unit = require('../models/unit')
const { Definition } = require('../../lib')

class CreateUnitInput extends Definition {
  static get schema() {
    return pick(Unit.documentSchema, [
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

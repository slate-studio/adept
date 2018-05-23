'use strict'

const Unit = require('../../models/unit')
const { Component } = require('../../../lib')

class UpdateUnitInput extends Component {
  static get schema() {
    const schema = Unit.documentSchema.clone(this.name, {
      only: [
        'state',
        'name',
        'beds',
        'staffingPeriod',
        'minimumStaffingRequirementId',
        'hppdTarget',
        'schedulingStartsAt',
        'dayStartTime',
        'nightStartTime',
      ]
    })

    for (const name in schema.source) {
      delete schema.source[name].required
    }

    return schema
  }
}

module.exports = UpdateUnitInput

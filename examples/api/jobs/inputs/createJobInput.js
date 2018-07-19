'use strict'

const Job = require('../../../models/job')
const { Component } = require('../../../../lib')

class CreateJobInput extends Component {
  static get schema() {
    const schema = Job.documentSchema.clone(this.name, {
      only: [
        'type',
        'parameters'
      ]
    })

    return schema
  }
}

module.exports = CreateJobInput

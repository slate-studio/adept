'use strict'

const pick = require('lodash.pick')
const Job  = require('../models/job')
const { Definition } = require('../../lib')

class CreateJobInput extends Definition {
  static get schema() {
    return pick(Job.documentSchema, [
      'type',
      'parameters'
    ])
  }
}

module.exports = CreateJobInput

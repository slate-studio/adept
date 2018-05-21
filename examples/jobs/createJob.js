'use strict'

const Job        = require('../models/unit')
const { Create } = require('../../lib')
const CreateJobInput = require('./createJobInput')

class CreateJob extends Create {
  static get tags() {
    return [ 'Jobs' ]
  }

  static get resource() {
    return Job
  }

  static get input() {
    return CreateJobInput
  }
}

module.exports = CreateJob

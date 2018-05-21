'use strict'

const Job     = require('../models/job')
const { Index } = require('../../lib')

class IndexJobs extends Index {
  static get tags() {
    return [ 'Jobs' ]
  }

  static get resource() {
    return Job
  }
}

module.exports = IndexJobs

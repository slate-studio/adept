'use strict'

const Unit = require('../../../models/unit')
const { Component } = require('../../../../lib')

class CreateUnitInput extends Component {
  static get schema() {
    const schema = Unit.documentSchema.clone(this.name)
    return schema
  }
}

module.exports = CreateUnitInput

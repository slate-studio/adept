'use strict'

const Component = require('./component')

class Document extends Component {
  constructor(attributes) {
    super()
    this.attributes = attributes || {}
  }

  static getSchema() {
    throw new Error(`${this.name}.getSchema() is not defined`)
  }

  static get commonSchema() {
    return this.getSchema('Common')
  }

  static get documentSchema() {
    return this.getSchema(this.name)
  }

  static get schema() {
    if (!this._schema) {
      this._schema = this.commonSchema.extendWith(this.name, this.documentSchema)
    }

    return this._schema
  }

  toJSON() {
    return this.attributes
  }

  get id() {
    return this.attributes.id
  }
}

module.exports = Document

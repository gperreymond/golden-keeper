class Query {
  constructor () {
    this.action = {}
    this.action.metadata = {
      cqrs: {
        type: 'Query'
      }
    }
  }

  setHandler (value) {
    this.action.handler = value
  }

  setModel (schema) {
    this.action.metadata.cqrs.model = schema
  }

  getAction () {
    return this.action
  }
}

module.exports = Query

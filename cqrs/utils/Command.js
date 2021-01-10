class Command {
  constructor () {
    this.action = {}
    this.action.metadata = {
      cqrs: {
        type: 'Command'
      }
    }
  }

  setHandler (value) {
    this.action.handler = value
  }

  setModel (schema) {
    this.action.metadata.cqrs.model = schema
  }

  setEventType (value) {
    this.action.metadata.cqrs.eventType = value
  }

  setAggregateType (value) {
    this.action.metadata.cqrs.aggregateType = value
  }

  getAction () {
    return this.action
  }
}

module.exports = Command

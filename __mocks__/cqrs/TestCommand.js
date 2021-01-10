const { Command } = require('../../cqrs/utils')

const handler = async function (ctx) {
  return true
}

const command = new Command()
command.setHandler(handler)
command.setEventType('TestEvent')
command.setAggregateType('TestType')
command.setModel({
  name: { type: 'string', min: 3 }
})

module.exports = command

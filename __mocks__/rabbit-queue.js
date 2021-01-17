const EventEmitter = require('events').EventEmitter
const util = require('util')

class Rabbit {
  constructor () {
    // call the super constructor to initialize `this`
    EventEmitter.call(this)
    // your own initialization of `this` follows here
    this.$queues = {}
  }

  createQueue (target, options, callback) {
    this.$queues[target] = {}
    this.$queues[target].fn = callback
    if (options.error_rabbitmq) { return this.emit('disconnected') }
  }

  bindToExchange (target, exchange, key) {
    this.$queues[target].key = key
  }

  async publish (target, message) {
    if (message.error) { throw new Error('An error occured.') }
    await this.$queues[target].fn({
      fields: {
        routingKey: this.$queues[target].key
      },
      content: JSON.stringify(message)
    }, () => true)
    return true
  }
}

module.exports = {
  Rabbit
}

util.inherits(Rabbit, EventEmitter)

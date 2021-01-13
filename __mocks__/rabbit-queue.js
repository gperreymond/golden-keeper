class Rabbit {
  constructor () {
    this.$queues = {}
  }

  on () {}

  createQueue (target, options, callback) {
    this.$queues[target] = {}
    this.$queues[target].fn = callback
  }

  bindToExchange (target, exchange, key) {
    this.$queues[target].key = key
  }

  async publish (target, message) {
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

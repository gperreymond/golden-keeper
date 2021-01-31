const { Rabbit } = require('rabbit-queue')

module.exports = {
  // Must overwrite it
  name: '',
  settings: {
    rabbitmq: {
      hostname: '',
      port: 0,
      username: '',
      password: '',
      vhost: '',
      aliases: {}
    }
  },
  hooks: {
    before: {
      '*': ['GetRabbitmq']
    }
  },
  // Service's metadata
  metadata: {
    $rabbitmq: false,
    $bindings: []
  },
  methods: {
    async GetRabbitmq (ctx) {
      ctx.meta.$rabbitmq = this.metadata.$rabbitmq
      return true
    }
  },
  created () {
    this.logger.info('rabbitmq mixin created')
    const options = `amqp://${this.settings.rabbitmq.username}:${this.settings.rabbitmq.password}@${this.settings.rabbitmq.hostname}:${this.settings.rabbitmq.port}`
    this.metadata.$rabbitmq = new Rabbit(options, {
      prefetch: 1,
      replyPattern: false,
      scheduledPublish: false
    })
    this.metadata.$rabbitmq.on('connected', () => {
      this.logger.info('rabbitmq connected')
    })
    this.metadata.$rabbitmq.on('disconnected', (err) => {
      this.logger.error('Rabbitmq disconnected', err)
    })
  },
  async started () {
    this.logger.info('rabbitmq mixin started')
    // Step 1: From aliases to bindins
    const aliases = this.settings.rabbitmq.aliases
    const keys = Object.keys(aliases)
    keys.map(name => {
      const { type } = aliases[name]
      this.metadata.$bindings.push({ exchange: `amq.${type}`, target: `moleculer.${name}.queue`, key: `moleculer.${name}.key` })
      return true
    })
    // Step 2: From bindings to rabbitmq queue
    this.metadata.$bindings.map(binding => {
      const base = { durable: true, autoDelete: false }
      const options = { ...base }
      this.metadata.$rabbitmq.createQueue(binding.target, options, async (msg, ack) => {
        const routingKey = msg.fields.routingKey
        const refName = routingKey.split('.')[1]
        const item = aliases[refName]
        try {
          await this.broker.call(item.subscriber, JSON.parse(msg.content.toString()))
          ack()
          return true
        } catch (e) {
          ack(e.message)
          return false
        }
      })
      this.metadata.$rabbitmq.bindToExchange(binding.target, binding.exchange, binding.key)
      return true
    })
  }
}

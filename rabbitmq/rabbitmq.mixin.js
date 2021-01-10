const { Rabbit } = require('rabbit-queue')

module.exports = {
  // Must overwrite it
  name: '',
  settings: {
    hostname: '',
    port: 0,
    username: '',
    password: '',
    vhost: '',
    aliases: {}
  },
  // Service's metadata
  metadata: {
    $rabbitmq: false
  },
  created () {
    this.logger.info('rabbitmq mixin created')
    const options = `amqp://${this.settings.username}:${this.settings.password}@${this.settings.hostname}:${this.settings.port}`
    console.log(options)
    this.metadata.$rabbitmq = new Rabbit(options, {
      prefetch: 1,
      replyPattern: false,
      scheduledPublish: false
    })
    this.metadata.$rabbitmq.on('connected', () => {
      this.logger.info('rabbitmq connected')
    })
    this.metadata.$rabbitmq.on('disconnected', (err) => {
      if (!err) { return false }
      this.logger.error(err.message)
    })
  },
  async started () {
    this.logger.info('rabbitmq mixin started')
  }
}

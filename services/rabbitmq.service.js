const RabbitMQMixin = require('../rabbitmq/rabbitmq.mixin')

const { rabbitmq } = require('../application.config')

module.exports = {
  name: 'RabbitMQ',
  mixins: [RabbitMQMixin],
  settings: {
    ...rabbitmq,
    aliases: {
      'SUB AwsInstanceQueue': ''
    }
  }
}

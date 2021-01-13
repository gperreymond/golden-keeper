const RabbitMQMixin = require('../rabbitmq/rabbitmq.mixin')

const { rabbitmq } = require('../application.config')

module.exports = {
  name: 'Timeseries',
  mixins: [RabbitMQMixin],
  settings: {
    ...rabbitmq,
    aliases: {
      'timeseries-aws-ec2-instance': {
        type: 'direct',
        publisher: 'Timeseries.AwsEcs2InstancePublisher',
        subscriber: 'Timeseries.AwsEc2InstanceSubscriber'
      }
    }
  },
  actions: {
    AwsEcs2InstancePublisher: async function (ctx) {
      await ctx.meta.$rabbitmq.publish('moleculer.timeseries-aws-ec2-instance.queue', ctx.params)
      return true
    },
    AwsEc2InstanceSubscriber: async function (ctx) {
      await ctx.broker.call('RethinkDBAdapterAwsEc2Instances.create', ctx.params)
      return true
    }
  }
}

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
      },
      'timeseries-aws-ec2-instance-pricing': {
        type: 'direct',
        publisher: 'Timeseries.AwsEcs2InstancePricingPublisher',
        subscriber: 'Timeseries.AwsEc2InstancePricingSubscriber'
      }
    }
  },
  actions: {
    AwsEcs2InstancePublisher: async function (ctx) {
      await ctx.meta.$rabbitmq.publish('moleculer.timeseries-aws-ec2-instance.queue', ctx.params)
      return true
    },
    AwsEc2InstanceSubscriber: async function (ctx) {
      // console.log(ctx.params)
      await ctx.broker.call('RethinkDBAdapterAwsEc2Instances.create', ctx.params)
      return true
    },
    AwsEcs2InstancePricingPublisher: async function (ctx) {
      await ctx.meta.$rabbitmq.publish('moleculer.timeseries-aws-ec2-instance-pricing.queue', ctx.params)
      return true
    },
    AwsEc2InstancePricingSubscriber: async function (ctx) {
      // console.log(ctx.params)
      await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesPricing.create', ctx.params)
      return true
    }
  }
}

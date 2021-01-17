const RabbitMQMixin = require('../timeseries/rabbitmq.mixin')

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
    AwsEcs2InstancePublisher: {
      cache: false,
      ...require('../timeseries/publishers/AwsEcs2InstancePublisher')
    },
    AwsEc2InstanceSubscriber: {
      cache: false,
      ...require('../timeseries/subscribers/AwsEc2InstanceSubscriber')
    },
    AwsEcs2InstancePricingPublisher: {
      cache: false,
      ...require('../timeseries/publishers/AwsEcs2InstancePricingPublisher')
    },
    AwsEc2InstancePricingSubscriber: {
      cache: false,
      ...require('../timeseries/subscribers/AwsEc2InstancePricingSubscriber')
    }
  }
}

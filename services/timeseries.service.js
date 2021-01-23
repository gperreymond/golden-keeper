const RabbitMQMixin = require('../timeseries/rabbitmq.mixin')

const { rabbitmq } = require('../application.config')

module.exports = {
  name: 'Timeseries',
  mixins: [RabbitMQMixin],
  settings: {
    ...rabbitmq,
    aliases: {
      'timeseries-aws-ec2-instance-details': {
        type: 'direct',
        publisher: 'Timeseries.AwsEcs2InstanceDetailsPublisher',
        subscriber: 'Timeseries.AwsEc2InstanceDetailsSubscriber'
      },
      'timeseries-aws-ec2-instance-pricing': {
        type: 'direct',
        publisher: 'Timeseries.AwsEcs2InstancePricingPublisher',
        subscriber: 'Timeseries.AwsEc2InstancePricingSubscriber'
      }
    }
  },
  actions: {
    AwsEcs2InstanceDetailsPublisher: {
      cache: false,
      ...require('../timeseries/publishers/AwsEcs2InstanceDetailsPublisher')
    },
    AwsEc2InstanceDetailsSubscriber: {
      cache: false,
      ...require('../timeseries/subscribers/AwsEc2InstanceDetailsSubscriber')
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

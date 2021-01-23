const CQRSMixin = require('../cqrs/cqrs.mixin')

module.exports = {
  name: 'AwsDomain',
  mixins: [CQRSMixin],
  actions: {
    // Commands
    CollectAwsEc2InstancesDetailsByRegionCommand: {
      cache: false,
      ...require('../cqrs/domains/aws/commands/CollectAwsEc2InstancesDetailsByRegionCommand').getAction()
    },
    CollectAwsEc2InstancesPricingByRegionCommand: {
      cache: false,
      ...require('../cqrs/domains/aws/commands/CollectAwsEc2InstancesPricingByRegionCommand').getAction()
    },
    // Queries
    GetAwsEc2InstancesListQuery: {
      cache: false,
      ...require('../cqrs/domains/aws/queries/GetAwsEc2InstancesListQuery').getAction()
    }
  }
}

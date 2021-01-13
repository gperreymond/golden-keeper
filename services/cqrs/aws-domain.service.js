const CQRSMixin = require('../../cqrs/cqrs.mixin')

module.exports = {
  name: 'AwsDomain',
  mixins: [CQRSMixin],
  actions: {
    // Commands
    CollectAwsEc2InstancesDetailsByRegionCommand: {
      cache: false,
      ...require('../../cqrs/domains/aws/commands/CollectAwsEc2InstancesDetailsByRegionCommand.js').getAction()
    }
    // Queries
  }
}

const CQRSMixin = require('../cqrs/cqrs.mixin')
const RethinkDbMixin = require('../cqrs/rethinkdb.mixin')

const { rethinkdb } = require('../application.config')

module.exports = {
  name: 'AwsDomain',
  mixins: [CQRSMixin, RethinkDbMixin],
  settings: {
    rethinkdb: {
      host: rethinkdb.hostname,
      port: rethinkdb.port,
      user: rethinkdb.username,
      password: rethinkdb.password,
      db: rethinkdb.database
    }
  },
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

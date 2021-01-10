const CQRSMixin = require('../cqrs/cqrs.mixin')

module.exports = {
  name: 'AwsDomain',
  mixins: [CQRSMixin],
  hooks: {
    before: {
      '*': ['ExtractActionMetadata', 'ValidateCQRSParams']
    },
    after: {
      '*': ['EmitEventSourcing', 'ResponseCQRS']
    },
    error: {
      '*': ['ErrorCQRS']
    }
  },
  actions: {
    // Commands
    // Queries
    GetAwsEc2InstancesListByRegionQuery: {
      cache: false,
      ...require('../cqrs/domains/aws/queries/GetAwsEc2InstancesListByRegionQuery.js').getAction()
    }
  },
  methods: {
  }
}

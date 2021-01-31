const CQRSMixin = require('../cqrs/cqrs.mixin')

module.exports = {
  name: 'SystemDomain',
  mixins: [CQRSMixin],
  actions: {
    // Commands
    // Queries
    GetStatusLivenessQuery: {
      cache: false,
      ...require('../cqrs/domains/system/queries/GetStatusLivenessQuery').getAction()
    },
    GetStatusReadinessQuery: {
      cache: false,
      ...require('../cqrs/domains/system/queries/GetStatusReadinessQuery').getAction()
    }
  }
}

const WebMixin = require('moleculer-web')

const { moleculer: { port } } = require('../application.config')

module.exports = {
  name: 'ApiGateway',
  mixins: [WebMixin],
  settings: {
    port,
    // Global CORS settings for all routes
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: '*',
      // Configures the Access-Control-Allow-Methods CORS header.
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: [],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
    },
    routes: [{
      mappingPolicy: 'restrict',
      aliases: {
        'GET status/liveness': 'SystemDomain.GetStatusLivenessQuery',
        'GET status/readiness': 'SystemDomain.GetStatusReadinessQuery',
        'GET api/v1/aws/instances': 'AwsDomain.GetAwsEc2InstancesListQuery'
      }
    }]
  }
}

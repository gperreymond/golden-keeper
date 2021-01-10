const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf.json' })

// ************************************
// Typecasting from kube env
// ************************************
let APP_MOLECULER_API_GATEWAY_PORT = 4000
let APP_MOLECULER_METRICS_PORT = 4040
let APP_NATS_PORT = 4222
let APP_RABBITMQ_PORT = 5672
let APP_RETHINKDB_PORT = 28015
// ************************************
if (nconf.get('APP_MOLECULER_API_GATEWAY_PORT')) { APP_MOLECULER_API_GATEWAY_PORT = parseInt(nconf.get('APP_MOLECULER_API_GATEWAY_PORT')) }
if (nconf.get('APP_MOLECULER_METRICS_PORT')) { APP_MOLECULER_METRICS_PORT = parseInt(nconf.get('APP_MOLECULER_METRICS_PORT')) }
if (nconf.get('APP_NATS_PORT')) { APP_NATS_PORT = parseInt(nconf.get('APP_NATS_PORT')) }
if (nconf.get('APP_RABBITMQ_PORT')) { APP_RABBITMQ_PORT = parseInt(nconf.get('APP_RABBITMQ_PORT')) }
if (nconf.get('APP_RETHINKDB_PORT')) { APP_RETHINKDB_PORT = parseInt(nconf.get('APP_RETHINKDB_PORT')) }
// ************************************

const APP_RETHINKDB_HOSTNAME = nconf.get('APP_RETHINKDB_HOSTNAME') || 'localhost'
const APP_RETHINKDB_USERNAME = nconf.get('APP_RETHINKDB_USERNAME') || 'admin'
const APP_RETHINKDB_PASSWORD = nconf.get('APP_RETHINKDB_PASSWORD') || 'password'

module.exports = {
  moleculer: {
    port: APP_MOLECULER_API_GATEWAY_PORT,
    metrics: APP_MOLECULER_METRICS_PORT
  },
  nats: {
    port: APP_NATS_PORT
  },
  rabbitmq: {
    port: APP_RABBITMQ_PORT
  },
  rethinkdb: {
    hostname: APP_RETHINKDB_HOSTNAME,
    port: APP_RETHINKDB_PORT,
    username: APP_RETHINKDB_USERNAME,
    password: APP_RETHINKDB_PASSWORD,
    database: 'golden_keeper'
  }
}

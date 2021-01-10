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
let APP_TIMESCALEDB_PORT = 5432
// ************************************
if (nconf.get('APP_MOLECULER_API_GATEWAY_PORT')) { APP_MOLECULER_API_GATEWAY_PORT = parseInt(nconf.get('APP_MOLECULER_API_GATEWAY_PORT')) }
if (nconf.get('APP_MOLECULER_METRICS_PORT')) { APP_MOLECULER_METRICS_PORT = parseInt(nconf.get('APP_MOLECULER_METRICS_PORT')) }
if (nconf.get('APP_NATS_PORT')) { APP_NATS_PORT = parseInt(nconf.get('APP_NATS_PORT')) }
if (nconf.get('APP_RABBITMQ_PORT')) { APP_RABBITMQ_PORT = parseInt(nconf.get('APP_RABBITMQ_PORT')) }
if (nconf.get('APP_RETHINKDB_PORT')) { APP_RETHINKDB_PORT = parseInt(nconf.get('APP_RETHINKDB_PORT')) }
if (nconf.get('APP_TIMESCALEDB_PORT')) { APP_TIMESCALEDB_PORT = parseInt(nconf.get('APP_TIMESCALEDB_PORT')) }
// ************************************

const APP_TIMESCALEDB_HOSTNAME = nconf.get('APP_TIMESCALEDB_HOSTNAME') || 'localhost'
const APP_TIMESCALEDB_USERNAME = nconf.get('APP_TIMESCALEDB_USERNAME') || 'postgres'
const APP_TIMESCALEDB_PASSWORD = nconf.get('APP_TIMESCALEDB_PASSWORD') || 'password'

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
    port: APP_RETHINKDB_PORT
  },
  timescaledb: {
    hostname: APP_TIMESCALEDB_HOSTNAME,
    port: APP_TIMESCALEDB_PORT,
    username: APP_TIMESCALEDB_USERNAME,
    password: APP_TIMESCALEDB_PASSWORD,
    database: 'golden_keeper'
  }
}

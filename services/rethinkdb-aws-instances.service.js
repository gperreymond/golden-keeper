const DbService = require('moleculer-db')
const RethinkDBAdapter = require('moleculer-db-adapter-rethinkdb')

const { rethinkdb } = require('../application.config')

module.exports = {
  name: 'RethinkDBAdapterAwsInstances',
  mixins: [DbService],
  adapter: new RethinkDBAdapter({
    host: rethinkdb.hostname,
    port: rethinkdb.port,
    username: rethinkdb.username,
    password: rethinkdb.password
  }),
  database: rethinkdb.database,
  table: 'aws_instances'
}

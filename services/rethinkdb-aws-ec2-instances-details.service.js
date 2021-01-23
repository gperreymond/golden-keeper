const DbService = require('moleculer-db')
const RethinkDBAdapter = require('moleculer-db-adapter-rethinkdb')

const { rethinkdb } = require('../application.config')

module.exports = {
  name: 'RethinkDBAdapterAwsEc2InstancesDetails',
  mixins: [DbService],
  adapter: new RethinkDBAdapter({
    host: rethinkdb.hostname,
    port: rethinkdb.port,
    username: rethinkdb.username,
    password: rethinkdb.password
  }),
  database: rethinkdb.database,
  table: 'aws_ec2_instances_details'
}

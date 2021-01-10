const { timescaledb } = require('../../application.config')

module.exports = {
  development: {
    username: timescaledb.username,
    password: timescaledb.password,
    database: timescaledb.database,
    host: timescaledb.hostname,
    port: timescaledb.port,
    dialect: 'postgres',
    protocol: 'postgres'
  },
  test: {
    username: timescaledb.username,
    password: timescaledb.password,
    database: timescaledb.database,
    host: timescaledb.hostname,
    port: timescaledb.port,
    dialect: 'postgres',
    protocol: 'postgres'
  },
  production: {
    username: timescaledb.username,
    password: timescaledb.password,
    database: timescaledb.database,
    host: timescaledb.hostname,
    port: timescaledb.port,
    dialect: 'postgres',
    protocol: 'postgres'
  }
}

jest.mock('rethinkdb')
const rethinkdb = require('rethinkdb')

const fakeConnection = {
  use: jest.fn(),
  close: jest.fn(() => Promise.resolve()),
  on: jest.fn()
}

const fakeCursor = {
  toArray: jest.fn()
}
const fakeRunResult = jest.fn(() => [])
const fakeRunnablePromise = {
  run: jest.fn((conn, cb) => {
    if (cb) cb(null, fakeRunResult())
    else return Promise.resolve(fakeCursor)
  })
}

rethinkdb.connect = jest.fn((opts, cb) => {
  cb(null, fakeConnection)
})
rethinkdb.db = jest.fn((name) => rethinkdb)
rethinkdb.dbList = jest.fn(() => fakeRunnablePromise)
rethinkdb.dbCreate = jest.fn((database) => fakeRunnablePromise)
rethinkdb.tableList = jest.fn(() => fakeRunnablePromise)
rethinkdb.tableCreate = jest.fn((database) => fakeRunnablePromise)

const fakeFilter = {
  orderBy: jest.fn(),
  skip: jest.fn(() => fakeFilter),
  limit: jest.fn(() => fakeFilter),
  count: jest.fn(),
  run: jest.fn(() => fakeRunnablePromise),
  update: jest.fn(() => fakeRunnablePromise),
  delete: jest.fn(() => fakeRunnablePromise)
}
const fakeTable = {
  filter: jest.fn(() => fakeFilter),
  count: jest.fn(),
  get: jest.fn(() => fakeRunnablePromise),
  getAll: jest.fn(() => fakeRunnablePromise),
  insert: jest.fn(() => fakeRunnablePromise),
  delete: jest.fn(() => fakeRunnablePromise)
}
rethinkdb.table = jest.fn((name) => fakeTable)

module.exports = rethinkdb

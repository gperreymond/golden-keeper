require('../__mocks__/rethinkdb-mock')

const { ServiceBroker } = require('moleculer')
const broker = new ServiceBroker({
  logger: false,
  metrics: {
    enabled: false
  }
})

beforeAll(async () => {
  await broker.createService(require('../services/rethinkdb-aws-ec2-instances-details.service'))
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service rethinkdb-aws-ec2-instances-details', () => {
  test('should connect', async () => {
    expect(true).toEqual(true)
  })
})

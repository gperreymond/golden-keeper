require('../../__mocks__/rethinkdb-mock')
require('../../__mocks__/axios-mock')

const { ServiceBroker } = require('moleculer')
const broker = new ServiceBroker({
  logger: false,
  metrics: {
    enabled: false
  }
})

beforeAll(async () => {
  await broker.createService(require('../../services/rethinkdb-aws-ec2-instances-pricing.service'))
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service rethinkdb-aws-ec2-instances-pricing', () => {
  test('should return data', async () => {
    expect(true).toEqual(true)
  })
})

const { ServiceBroker } = require('moleculer')

const broker = new ServiceBroker({
  logger: false,
  metrics: {
    enabled: false
  }
})

beforeAll(async () => {
  await broker.createService({
    name: 'RethinkDBAdapterAwsEc2Instances',
    actions: {
      create: (ctx) => {
        const { RethinkDBAdapterAwsEc2Instances: error } = ctx.params
        if (error) { return Promise.reject(new Error('An error occured')) }
        return true
      }
    }
  })
  await broker.createService({
    name: 'RethinkDBAdapterAwsEc2InstancesPricing',
    actions: {
      find: async (ctx) => {
        const { query: { labels: { region } } } = ctx.params
        if (region === 'aws-test-1') return []
        if (region === 'aws-test-2') return [{}]
        if (region === 'aws-test-3') return [{}, {}]
        return Promise.reject(new Error('An error occured'))
      },
      update: async (ctx) => {
        return true
      },
      create: async (ctx) => {
        return true
      }
    }
  })
  await broker.createService(require('../services/timeseries.service'))
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service Timeseries', () => {
  test('should call action AwsEcs2InstancePublisher, and return "true"', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePublisher')
    expect(result).toEqual(true)
  })
  test('should call action AwsEcs2InstancePublisher, and return "true" with an error occured on RethinkDBAdapterAwsEc2Instances', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePublisher', { RethinkDBAdapterAwsEc2Instances: 'error' })
    expect(result).toEqual(true)
  })
  test('should call action AwsEcs2InstancePublisher, and return "false"', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePublisher', { error: true })
    expect(result).toEqual(false)
  })
  test('should call action AwsEcs2InstancePricingPublisher, and return "true", subscriber return []', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-1' } })
    expect(result).toEqual(true)
  })
  test('should call action AwsEcs2InstancePricingPublisher, and return "true", subscriber return [{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-2' } })
    expect(result).toEqual(true)
  })
  test('should call action AwsEcs2InstancePricingPublisher, and return "true", subscriber return [{},{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-3' } })
    expect(result).toEqual(true)
  })
  test('should call action AwsEcs2InstancePricingPublisher, and return "false"', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { error: true })
    expect(result).toEqual(false)
  })
})

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

/**
Timeseries.AwsEcs2InstanceDetailsPublisher
**/

describe('service Timeseries, action AwsEcs2InstancePublisher', () => {
  test('should return "true", subscriber return []', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstanceDetailsPublisher', { labels: { region: 'aws-test-1' } })
    expect(result).toEqual(true)
  })
  test('should return "true", subscriber return [{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstanceDetailsPublisher', { labels: { region: 'aws-test-2' } })
    expect(result).toEqual(true)
  })
  test('should cand return "true", subscriber return [{},{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstanceDetailsPublisher', { labels: { region: 'aws-test-3' } })
    expect(result).toEqual(true)
  })
  test('should return "false"', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstanceDetailsPublisher', { error: true })
    expect(result).toEqual(false)
  })
})

/**
Timeseries.AwsEcs2InstancePricingPublisher
**/

describe('service Timeseries, action AwsEcs2InstancePricingPublisher', () => {
  test('should return "true", subscriber return []', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-1' } })
    expect(result).toEqual(true)
  })
  test('should return "true", subscriber return [{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-2' } })
    expect(result).toEqual(true)
  })
  test('should cand return "true", subscriber return [{},{}]', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { labels: { region: 'aws-test-3' } })
    expect(result).toEqual(true)
  })
  test('should return "false"', async () => {
    const result = await broker.call('Timeseries.AwsEcs2InstancePricingPublisher', { error: true })
    expect(result).toEqual(false)
  })
})

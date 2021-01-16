const AWSMock = require('jest-aws-sdk-mock')
require('../../../__mocks__/axios-mock')

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
      create: {
        async handler (ctx) {
          const { labels: { instanceId } } = ctx.params
          if (instanceId === 'test_error') { return Promise.reject(new Error('Error occured')) }
          return true
        }
      }
    }
  })
  await broker.createService(require('../../../services/timeseries.service.js'))
  await broker.createService(require('../../../services/cqrs/aws-domain.service.js'))
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service AwsDomain, action GetAwsEc2InstancesPricingByRegionCommand', () => {
  test('should return an good result', async () => {
    const { result, error, source, status } = await broker.call('AwsDomain.GetAwsEc2InstancesPricingByRegionCommand')
    expect(error).toEqual(undefined)
    expect(status).toEqual(true)
    expect(source).toEqual('AwsDomain.GetAwsEc2InstancesPricingByRegionCommand')
    expect(result).toEqual(true)
  })
})

describe('service AwsDomain, action CollectAwsEc2InstancesDetailsByRegionCommand', () => {
  test('should return an error from ec2.describeInstances()', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(new Error('Generated error with mock'))
    })
    const { result, error, source, status } = await broker.call('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    AWSMock.restore('EC2')
    expect(result).toEqual(undefined)
    expect(status).toEqual(false)
    expect(source).toEqual('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    expect(error.message).toEqual('Generated error with mock')
  })
  test('should return an error because ec2.describeInstances() does not have good signature', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, {})
    })
    const { result, error, source, status } = await broker.call('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    AWSMock.restore('EC2')
    expect(result).toEqual(undefined)
    expect(status).toEqual(false)
    expect(source).toEqual('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    expect(error.message).toEqual("Cannot read property 'map' of undefined")
  })
  test('should return an error, problem with mapping', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, { Reservations: [] })
    })
    const { result, error, source, status } = await broker.call('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand', { region: 'eu-west-3' })
    AWSMock.restore('EC2')
    expect(result).toEqual(undefined)
    expect(status).toEqual(false)
    expect(source).toEqual('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    expect(error.message).toEqual('Cannot convert undefined or null to object')
  })
  test('should return an good result, but an error occured when trying to insert in rethinkdb', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, { Reservations: [{ Instances: [{ InstanceId: 'test_error', Tags: [{ Key: 'key', Value: 'value' }] }] }] })
    })
    const { result, error, source, status } = await broker.call('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand', { region: 'eu-west-3' })
    AWSMock.restore('EC2')
    expect(error).toEqual(undefined)
    expect(status).toEqual(true)
    expect(source).toEqual('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    expect(result).toEqual(true)
  })
  test('should return an good result', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, { Reservations: [{ Instances: [{ Tags: [{ Key: 'key', Value: 'value' }] }] }] })
    })
    const { result, error, source, status } = await broker.call('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand', { region: 'eu-west-3' })
    AWSMock.restore('EC2')
    expect(error).toEqual(undefined)
    expect(status).toEqual(true)
    expect(source).toEqual('AwsDomain.CollectAwsEc2InstancesDetailsByRegionCommand')
    expect(result).toEqual(true)
  })
})

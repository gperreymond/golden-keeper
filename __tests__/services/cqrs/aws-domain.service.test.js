const AWSMock = require('jest-aws-sdk-mock')

const { ServiceBroker } = require('moleculer')
const broker = new ServiceBroker({
  logger: false,
  metrics: {
    enabled: false
  }
})

beforeAll(async () => {
  await broker.loadService('./services/cqrs/aws-domain.service')
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service AwsDomain, action GetAwsEc2InstancesListByRegionQuery', () => {
  test('should return an error from ec2.describeInstances()', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(new Error('Generated error with mock'))
    })
    const { result, error, source, status } = await broker.call('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    AWSMock.restore('EC2')
    expect(result).toEqual(undefined)
    expect(status).toEqual(false)
    expect(source).toEqual('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    expect(error.message).toEqual('Generated error with mock')
  })
  test('should return an error because ec2.describeInstances() does not have good signature', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, {})
    })
    const { result, error, source, status } = await broker.call('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    AWSMock.restore('EC2')
    expect(result).toEqual(undefined)
    expect(status).toEqual(false)
    expect(source).toEqual('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    expect(error.message).toEqual("Cannot read property 'map' of undefined")
  })
  test('should return an empty result', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, { Reservations: [] })
    })
    const { result, error, source, status } = await broker.call('AwsDomain.GetAwsEc2InstancesListByRegionQuery', { region: 'eu-west-3' })
    AWSMock.restore('EC2')
    expect(error).toEqual(undefined)
    expect(status).toEqual(true)
    expect(source).toEqual('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    expect(result.total).toEqual(0)
  })
  test('should return an good result', async () => {
    AWSMock.mock('EC2', 'describeInstances', function (params, callback) {
      callback(null, { Reservations: [{ Instances: [{}] }] })
    })
    const { result, error, source, status } = await broker.call('AwsDomain.GetAwsEc2InstancesListByRegionQuery', { region: 'eu-west-3' })
    AWSMock.restore('EC2')
    expect(error).toEqual(undefined)
    expect(status).toEqual(true)
    expect(source).toEqual('AwsDomain.GetAwsEc2InstancesListByRegionQuery')
    expect(result.total).toEqual(1)
  })
})

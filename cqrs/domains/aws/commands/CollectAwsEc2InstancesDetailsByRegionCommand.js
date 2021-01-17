const AWS = require('aws-sdk')
const { camelCase } = require('lodash')

const { Command } = require('../../../utils')

const describeInstancesSync = (region, params) => {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2({ region })
    ec2.describeInstances(params, function (err, data) {
      if (err) { return reject(err) }
      resolve(data)
    })
  })
}

const handler = async function (ctx) {
  // Extract some data
  const { region = 'eu-west-1' } = ctx.params
  // Call aws sdk
  const params = {
    MaxResults: 9999
  }
  const result = {
    total: 0,
    data: []
  }
  const data = await describeInstancesSync(region, params)
  data.Reservations.map(reservation => {
    reservation.Instances.map(async instance => {
      const {
        InstanceId: instanceId = '',
        InstanceType: instanceType = '',
        LaunchTime: launchTime = new Date(),
        Placement: { AvailabilityZone: availabilityZone } = { AvailabilityZone: '' },
        PrivateDnsName: privateDnsName = '',
        PrivateIpAddress: privateIpAddress = '',
        PublicDnsName: publicDnsName = '',
        PublicIpAddress: publicIpAddress = '',
        State: { Name: state } = { Name: 'none' },
        Tags: tags = []
      } = instance
      const data = {
        instanceId,
        instanceType,
        launchTime: new Date(launchTime).getTime(),
        region: availabilityZone.slice(0, -1),
        state,
        privateDnsName,
        privateIpAddress,
        publicDnsName,
        publicIpAddress,
        tags
      }
      result.data.push(data)
      result.total += 1
      return true
    })
    return true
  })
  // Publish to timeseries eventsource
  const total = result.data.length
  let current = 0
  do {
    // Prepare timeserie
    const timeserie = { time: new Date().getTime(), labels: {} }
    const props = Object.keys(result.data[current])
    props.map(key => {
      timeserie.labels[camelCase(key)] = result.data[current][key]
      result.data[current].tags.map(tag => {
        const key = camelCase(`tags_${tag.Key}`)
        timeserie.labels[key] = tag.Value
        return true
      })
      // Delete not mandatory props
      delete timeserie.labels.privateDnsName
      delete timeserie.labels.privateIpAddress
      delete timeserie.labels.publicDnsName
      delete timeserie.labels.publicIpAddress
      delete timeserie.labels.tags
      return true
    })
    await this.broker.call('Timeseries.AwsEcs2InstancePublisher', timeserie)
    current += 1
  } while (current < total)
  // Return the result
  return {
    aggregateID: `urn:golden-keeper:aws-ec2-instances-details:${region}`
  }
}

const command = new Command()
command.setEventType('AwsEc2InstancesDetailsByRegionCollected')
command.setAggregateType('AwsEc2InstancesDetails')
command.setHandler(handler)

module.exports = command

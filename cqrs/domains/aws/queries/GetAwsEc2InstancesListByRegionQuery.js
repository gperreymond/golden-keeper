const AWS = require('aws-sdk')

const { Query } = require('../../../utils')

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
  // Generate uuid
  ctx.params.id = ctx.broker.generateUid()
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
    reservation.Instances.map(instance => {
      const {
        InstanceId: instanceId = '',
        InstanceType: instanceType = '',
        Placement: { AvailabilityZone: availabilityZone } = { AvailabilityZone: '' },
        PrivateDnsName: privateDnsName = '',
        PrivateIpAddress: privateIpAddress = '',
        PublicDnsName: publicDnsName = '',
        PublicIpAddress: publicIpAddress = '',
        State: { Name: state } = {},
        Tags: tags = []
      } = instance
      const data = {
        instanceId,
        instanceType,
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
  return result
}

const query = new Query()
query.setHandler(handler)

module.exports = query

const axios = require('axios')

const { Command } = require('../../../utils')

const handler = async function (ctx) {
  // Extract some data
  const { region = 'eu-west-1' } = ctx.params
  // Call aws for princing
  const AWS_PRINCING_URL = `https://a0.p.awsstatic.com/pricing/1.0/ec2/region/${region}/ondemand/linux/index.json`
  const { data: { prices = [] } } = await axios.get(AWS_PRINCING_URL)
  const result = {
    total: 0,
    data: []
  }
  prices.map(item => {
    const data = { region, price: item.price, unit: item.unit }
    const props = Object.keys(item.attributes)
    props.map(prop => {
      const splitting = prop.split(':')
      if (splitting.length === 3) { data[splitting[2]] = item.attributes[prop] }
      return true
    })
    result.total += 1
    result.data.push(data)
    return true
  })
  // Publish to timeseries eventsource
  const total = result.data.length
  let current = 0
  do {
    // Prepare timeserie
    const timeserie = { time: new Date().getTime(), labels: { ...result.data[current] } }
    await this.broker.call('Timeseries.AwsEcs2InstancePricingPublisher', timeserie)
    current += 1
  } while (current < total)
  // Return the result
  return {
    aggregateID: `urn:golden-keeper:aws-ec2-instances-pricing:${region}`
  }
}

const command = new Command()
command.setHandler(handler)

module.exports = command

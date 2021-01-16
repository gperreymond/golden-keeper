const axios = require('axios')

const { Query } = require('../../../utils')

const handler = async function (ctx) {
  // Extract some data
  const { region = 'eu-west-1' } = ctx.params
  // Generate uuid
  ctx.params.id = ctx.broker.generateUid()
  // Call aws for princing
  const AWS_PRINCING_URL = `https://a0.p.awsstatic.com/pricing/1.0/ec2/region/${region}/ondemand/linux/index.json`
  const { data: { prices = [] } } = await axios.get(AWS_PRINCING_URL)
  prices.map(item => {
    const data = { region, price: item.price, unit: item.unit }
    const props = Object.keys(item.attributes)
    props.map(prop => {
      const splitting = prop.split(':')
      if (splitting.length === 3) { data[splitting[2]] = item.attributes[prop] }
      return true
    })
    return true
  })
  return true
}

const query = new Query()
query.setHandler(handler)

module.exports = query

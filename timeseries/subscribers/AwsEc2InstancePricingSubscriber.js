const handler = async function (ctx) {
  try {
    const { labels: { region, instanceType } = { labels: {} } } = ctx.params
    const result = await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesPricing.find', {
      query: {
        labels: {
          region,
          instanceType
        }
      }
    })
    let item = false
    switch (result.length) {
      case 0:
        await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesPricing.create', ctx.params)
        break
      case 1:
        item = result[0]
        ctx.params.id = item.id
        await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesPricing.update', ctx.params)
        break
      default:
        throw new Error('RethinkDBAdapterAwsEc2InstancesPricing: Error found multiple entries')
    }
    return true
  } catch (e) {
    this.logger.error(e.message)
    return false
  }
}

module.exports = {
  handler
}

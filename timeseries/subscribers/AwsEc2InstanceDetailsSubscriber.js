const handler = async function (ctx) {
  try {
    const { labels: { region, instanceId } = { labels: {} } } = ctx.params
    const result = await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesDetails.find', {
      query: {
        labels: {
          region,
          instanceId
        }
      }
    })
    let item = false
    switch (result.length) {
      case 0:
        await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesDetails.create', ctx.params)
        break
      case 1:
        item = result[0]
        ctx.params.id = item.id
        await ctx.broker.call('RethinkDBAdapterAwsEc2InstancesDetails.update', ctx.params)
        break
      default:
        throw new Error('RethinkDBAdapterAwsEc2Instances: Error found multiple entries')
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

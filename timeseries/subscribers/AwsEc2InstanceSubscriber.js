const handler = async function (ctx) {
  try {
    await ctx.broker.call('RethinkDBAdapterAwsEc2Instances.create', ctx.params)
    return true
  } catch (e) {
    this.logger.error(e.message)
    return Promise.reject(e)
  }
}

module.exports = {
  handler
}

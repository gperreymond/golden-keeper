const handler = async function (ctx) {
  try {
    await ctx.meta.$rabbitmq.publish('moleculer.timeseries-aws-ec2-instance-details.queue', ctx.params)
    return true
  } catch (e) {
    this.logger.error(e.message)
    return false
  }
}

module.exports = {
  handler
}

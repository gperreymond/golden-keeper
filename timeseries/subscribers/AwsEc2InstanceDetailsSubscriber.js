const handler = async function (ctx) {
  console.log(ctx.params)
  return true
}

module.exports = {
  handler
}

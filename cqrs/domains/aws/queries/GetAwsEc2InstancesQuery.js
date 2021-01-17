const { Query } = require('../../../utils')

const handler = async function (ctx) {
  return true
}

const query = new Query()
query.setHandler(handler)

module.exports = query

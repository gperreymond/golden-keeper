const { Query } = require('../../../utils')

const handler = async function (ctx) {
  return {
    ready: true
  }
}

const query = new Query()
query.setHandler(handler)

module.exports = query

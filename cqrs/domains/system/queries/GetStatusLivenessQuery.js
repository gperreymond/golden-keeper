const { Query } = require('../../../utils')

const handler = async function (ctx) {
  return {
    alive: true
  }
}

const query = new Query()
query.setHandler(handler)

module.exports = query

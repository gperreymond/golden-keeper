const { Query } = require('../../cqrs/utils')

const handler = async function (ctx) {
  return true
}

const query = new Query()
query.setHandler(handler)
query.setModel({
  name: { type: 'string', min: 3 }
})

module.exports = query

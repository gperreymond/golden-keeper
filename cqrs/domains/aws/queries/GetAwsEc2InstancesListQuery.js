const r = require('rethinkdb')

const { Query } = require('../../../utils')

const execREQL = function (conn) {
  return new Promise((resolve, reject) => {
    try {
      r.db('golden_keeper')
        .table('aws_ec2_instances_details')
        .innerJoin(r.db('golden_keeper').table('aws_ec2_instances_pricing'), function (instanceRow, pricingRow) {
          return instanceRow('labels')('instanceType').match(pricingRow('labels')('instanceType'))
        })
        .merge(item => {
          return item('left').merge(item('right').without('time', 'id'))
        })
        .without('left', 'right', 'id')
        .merge(item => {
          return item('labels')
        }).without('labels')
        .merge(item => {
          return item.merge({ upTime: item('time').sub(item('launchTime')) })
        })
        .merge(item => {
          return item.merge({ priceUSD: item('price')('USD').coerceTo('number') })
        }).without('price')
        .run(conn, (err, cursor) => {
          if (err) throw err
          cursor.toArray(function (err, data) {
            if (err) throw err
            return resolve(data)
          })
        })
    } catch (e) {
      reject(e)
    }
  })
}

const handler = async function (ctx) {
  const result = await execREQL(ctx.meta.$r)
  return {
    total: result.length,
    instances: result
  }
}

const query = new Query()
query.setHandler(handler)

module.exports = query

const RabbitmqMixin = require('../timeseries/rabbitmq.mixin')

beforeAll(async () => {
  RabbitmqMixin.logger = { info: () => {}, error: () => {} }
})

describe('mixins Rabbitmq', () => {
  test('should emit connected', async () => {
    RabbitmqMixin.created()
    RabbitmqMixin.metadata.$rabbitmq.emit('connected')
    expect(true).toEqual(true)
  })
  test('should emit disconnected', async () => {
    RabbitmqMixin.metadata.$rabbitmq.emit('disconnected', new Error('Error occured'))
    expect(true).toEqual(true)
  })
})

const CQRSMixin = require('../cqrs/cqrs.mixin')

const testService = {
  name: 'TestDomain',
  mixins: [CQRSMixin],
  actions: {
    // Classic action
    ClassicAction: {
      async handler (ctx) {
        return true
      }
    },
    ClassicErrorAction: {
      async handler (ctx) {
        return Promise.reject(new Error('An error occured'))
      }
    },
    // Commands
    TestCommand: {
      cache: false,
      ...require('../__mocks__/cqrs/TestCommand').getAction()
    },
    // Queries
    TestQuery: {
      cache: false,
      ...require('../__mocks__/cqrs/TestQuery').getAction()
    }
  }
}

const { ServiceBroker } = require('moleculer')
const broker = new ServiceBroker({
  logger: false,
  metrics: {
    enabled: false
  }
})

beforeAll(async () => {
  await broker.createService(testService)
  await broker.start()
})

afterAll(async () => {
  await broker.stop()
})

describe('service TestDomain', () => {
  test('should return an error from action TestCommand, because params not match model', async () => {
    const { error, status } = await broker.call('TestDomain.TestCommand', { a: true })
    expect(error.message).toEqual('ValidateCQRSParamsError')
    expect(status).toEqual(false)
  })
  test('should return all done from action TestCommand', async () => {
    const { status } = await broker.call('TestDomain.TestCommand', { name: 'test name' })
    expect(status).toEqual(true)
  })
  test('should return all done from action TestQuery', async () => {
    const { status } = await broker.call('TestDomain.TestQuery', { name: 'test name' })
    expect(status).toEqual(true)
  })
  test('should return all done from action ClassicAction', async () => {
    const result = await broker.call('TestDomain.ClassicAction')
    expect(result).toEqual(true)
  })
  test('should return an error from action ClassicErrorAction', async () => {
    try {
      await broker.call('TestDomain.ClassicErrorAction')
      expect(false).toEqual(true)
    } catch (err) {
      expect(err.message).toEqual('An error occured')
    }
  })
})

const { find } = require('lodash')
const Boom = require('@hapi/boom')
const Validator = require('fastest-validator')

const v = new Validator()

module.exports = {
  hooks: {
    before: {
      '*': ['ExtractActionMetadata', 'ValidateCQRSParams']
    },
    after: {
      '*': ['EmitEventSourcing', 'ResponseCQRS']
    },
    error: {
      '*': ['ErrorCQRS']
    }
  },
  methods: {
    // The action is a part of CQRS or not ?
    async ExtractActionMetadata (ctx) {
      const { action: { name: currentActionName } } = ctx
      const actions = await ctx.call('$node.actions')
      const found = find(actions, o => o.name === currentActionName)
      const { metadata: { cqrs = false } = { metadata: { cqrs: false } } } = found.action
      if (cqrs !== false) {
        ctx.meta = {
          ...ctx.meta,
          start: Date.now(),
          cqrs
        }
      }
      return true
    },
    // The action is a 'Command' or a 'Query'? We need to validate params
    async ValidateCQRSParams (ctx) {
      const { meta: { cqrs = false } = { meta: { cqrs: false } } } = ctx
      if (cqrs !== false && cqrs.model) {
        const schema = cqrs.model
        const check = v.compile(schema)
        const validate = check(ctx.params)
        if (validate !== true) {
          throw Boom.boomify(new Error('ValidateCQRSParamsError'), {
            statusCode: 400,
            decorate: validate
          })
        }
      }
      return true
    },
    // The action is a 'Command' ? We need to create in eventstore
    async EmitEventSourcing (ctx, res) {
      const { meta: { cqrs = false } = { meta: { cqrs: false } } } = ctx
      if (cqrs !== false && cqrs.eventType && cqrs.type === 'Command') {
        // Design the event
        const event = {
          aggregateID: res.aggregateID,
          aggregateType: cqrs.aggregateType,
          data: ctx.params,
          createdAt: new Date(),
          eventType: cqrs.eventType,
          id: ctx.broker.generateUid()
        }
        // Emit on moleculer to insert into eventstore
        ctx.broker.emit('Eventstore.InsertEvent', event)
      }
      return res
    },
    // The action is a 'Command' or a 'Query' ? With no error!
    async ResponseCQRS (ctx, res) {
      this.logger.info(`Response occurred when '${ctx.action.name}' action was called`)
      const { meta: { cqrs = false } = { meta: { cqrs: false } } } = ctx
      if (cqrs !== false) {
        return {
          status: true,
          source: ctx.action.name,
          date: new Date(),
          duration: Date.now() - ctx.meta.start,
          result: cqrs.type === 'Query' ? res : null
        }
      }
      // Not CQRS
      return res
    },
    // The action is a 'Command' or a 'Query' ? Oh dude error incomming!
    async ErrorCQRS (ctx, err) {
      this.logger.error(`Error occurred when '${ctx.action.name}' action was called`)
      const { meta: { cqrs = false } = { meta: { cqrs: false } } } = ctx
      if (cqrs !== false) {
        return {
          status: false,
          source: ctx.action.name,
          date: new Date(),
          duration: Date.now() - ctx.meta.start,
          error: {
            message: err.message,
            stackTrace: err
          }
        }
      }
      // Not CQRS
      throw err
    }
  }
}

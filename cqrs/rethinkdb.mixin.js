const r = require('rethinkdb')

module.exports = {
  // Must overwrite it
  name: '',
  settings: {
    rethinkdb: {
      host: '',
      port: 0,
      db: '',
      user: '',
      password: ''
    }
  },
  hooks: {
    before: {
      '*': ['GetRethinkDb']
    }
  },
  // Service's metadata
  metadata: {
    $r: false
  },
  methods: {
    async GetRethinkDb (ctx) {
      ctx.meta.$r = this.metadata.$r
      return true
    }
  },
  async created () {
    this.logger.info('rethinkdb mixin created')
    this.metadata.$r = await r.connect(this.settings.rethinkdb).catch(err => {
      return Promise.reject(err)
    })
    return true
  }
}

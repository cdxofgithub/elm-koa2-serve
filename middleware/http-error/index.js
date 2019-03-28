const path = require('path')
const errCode = require('../../utils/errorCode')

module.exports = (opts = {}) => {
  // 增加环境变量，用来传入到视图中，方便调试
  const env = opts.env || process.env.NODE_ENV || 'development'

  let fileName = '500'
  return async (ctx, next) => {
    try {
      await next()
      if (ctx.response.status === 404 && !ctx.response.body) throw new Error(404)
    } catch (e) {
      const status = e.message || 500
      let data
      if (errCode[status]) {
        ctx.body = {
          status: status,
          message: errCode[status],
        }
        return
      } else if (status == 404) {
        data = {
          status: 404,
          message: '404',
          stack: e.stack
        }
        fileName = 404
      } else {
        data = {
          status: 500,
          message: '系统出错',
          stack: e.stack
        }
        fileName = 500
      }
      await ctx.render(`errorPage/${fileName}`, {
        data
      })
    }
  }
}
const router = require('koa-router')()

const v1 = require("./v1")
const v2 = require("./v2")

router.use('/v1', v1.routes())
router.use('/v2', v2.routes())


module.exports = router

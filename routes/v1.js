const router = require('koa-router')()
const User = require('../controller/v2/user')

router.post('/users/list', User.getUserList.bind(User));


module.exports = router
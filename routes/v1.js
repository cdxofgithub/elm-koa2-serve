const router = require('koa-router')()
const User = require('../controller/v2/user')
const Captchas = require('../controller/v1/category')

router.post('/users/list', User.getUserList.bind(User));
router.post('/captchas', Captchas.getCaptchas.bind(this));


module.exports = router
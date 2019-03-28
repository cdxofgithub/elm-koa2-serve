const router = require('koa-router')()
const User = require('../controller/v2/user')

router.post('/login', User.login.bind(User));
router.post('/register', User.register.bind(User));
router.post('/signout', User.signout.bind(User));


module.exports = router
const config = require('config-lite')(__dirname);
const mongoose = require('mongoose')
const glob = require('glob') //提前载入schema
const {
  resolve
} = require('path')

mongoose.Promise = global.Promise;

//连接数据库
mongoose.connect(config.url, {
  useCreateIndex: true,
  useNewUrlParser: true
})


let maxConnectTimes = 0
//把所有连接放到这里
//增加数据库监听事件
mongoose.connection.on('disconnected', () => {
  console.log(`----------数据库第${maxConnectTimes}次重连----------`)
  if (maxConnectTimes < 3) {
    maxConnectTimes++
    mongoose.connect(config.url)
  } else {
    throw new Error('数据库出现问题')
  }
})
mongoose.connection.on('error', err => {
  console.log(`----------数据库第${maxConnectTimes}次重连----------`)
  if (maxConnectTimes < 3) {
    maxConnectTimes++
    mongoose.connect(config.url)
  } else {
    throw new Error('数据库出现问题')
  }
})
//数据库连接成功
mongoose.connection.once('open', () => {
  console.log('Mongodb connected successfully')
  glob.sync(resolve(__dirname, '../model', '**/*.js')).forEach(require)
})
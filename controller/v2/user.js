const crypto = require("crypto")
const timeFormater = require("time-formater")

const AddressComponent = require('../../commom/addressComponent')
const UserModel = require("../../model/v2/user")
const UserInfoModel = require("../../model/v2/userInfo")

class User extends AddressComponent {
  constructor() {
    super()
  }
  _encryption(password) {
    const newpassword = this._MD5(this._MD5(password).substr(2, 7) + this._MD5(password))
    return newpassword
  }
  _MD5(password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }

  async login(ctx) {
    const { username, password } = ctx.request.body
    if (!username) {
      ctx.body = this.errCode("LOGIN_QUERY_ERROR") //参数错误
      return
    }
    if(!password) {
      ctx.body = this.errCode("LOGIN_QUERY_ERROR") //参数错误
      return
    }
    const user = await UserModel.findOne({username});
    if(!user) {
      ctx.body = this.errCode("USERNAME_NO_EXIST") //用户不存在
      return
    }
    const newpassword = this._encryption(password)
    if (user.password.toString() !== newpassword.toString()) {
      ctx.body = this.errCode("PASSWORD_ERROR") //密码错误
      return
    }
    const userInfo = await UserInfoModel.findOne({
      user_id: user.user_id
    }, '-_id') //? 第二个参数
    ctx.session.user_id = user.user_id
    ctx.body = {
      status: 0,
      data: userInfo,
      message: "登录成功"
    }
  }

  async register(ctx) {
    const { username, password } = ctx.request.body
    if (!username) {
      ctx.body = this.errCode("REGISTER_QUERY_ERROR") //参数错误
      return
    };
    if(!password) {
      ctx.body = this.errCode("REGISTER_QUERY_ERROR") //参数错误
      return
    };
    const user = await UserModel.findOne({username});
    if(user) {
      ctx.body = this.errCode("USERNAME_EXIST") //用户名已存在
      return
    };
    const newpassword = this._encryption(password)
    const user_id = await this.getId('user_id');
    const newUser = {
      username,
      password: newpassword,
      user_id
    }
    const cityInfo = await this.guessPosition();
    const register_time = timeFormater().format('YYYY-MM-DD HH:mm')
    const newUserInfo = {
      username,
      user_id,
      id: user_id,
      city: cityInfo.city,
      register_time
    }
    UserModel.create(newUser)
    const createUser = new UserInfoModel(newUserInfo);
    const userInfo = await createUser.save();
    ctx.session.user_id = user.user_id
    ctx.body = {
      status: 0,
      data: userInfo,
      message: "注册成功"
    }
  }
  async signout(ctx) {
    ctx.session.user_id = null
    console.log(ctx.session.user_id)
    ctx.body = {
      status: 0,
      message: "退出成功"
    }
  }
  async getUserList(ctx) {
    const { limit = 20, offset = 0 } = ctx.request.body
    const users = await UserInfoModel.find({}, '-_id').sort({
      user_id: -1
    }).limit(Number(limit)).skip(Number(offset))
    ctx.body = {
      status: 0,
      data: users,
      message: "获取用户列表成功"
    }
  }
}
module.exports = new User()
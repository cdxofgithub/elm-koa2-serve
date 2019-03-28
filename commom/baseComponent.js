const Ids = require('../model/ids')

class BaseComponent {
  constructor() {
    this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
  }
  async getId(type) {
    if (!this.idList.includes(type)) throw new Error(70001);
    try{
      const idData = await Ids.findOne();
      idData[type] ++ ;
      await idData.save();
      return idData[type]
    }catch(err){
      throw new Error(err)
    }
  }
  errCode(code) {
    const errCode = {
      REGISTER_QUERY_ERROR: {
        status: "40001",
        message: "注册参数错误"
      },
      LOGIN_QUERY_ERROR: {
        status: "40002",
        message: "登录参数错误"
      },
      USERNAME_NO_EXIST: {
        status: "60001",
        message: "用户不存在"
      },
      PASSWORD_ERROR: {
        status: "60002",
        message: "密码错误"
      },
      USERNAME_EXIST: {
        status: "60003",
        message: "用户名已存在"
      },
      ID_TYPE: {
        status: "70001",
        message: "id类型错误"
      },
      GET_IDS: {
        status: "70002",
        message: "获取ids数据失败"
      }
    }
    if (!errCode[code]) {
      console.log('状态码出错请检查')
    }
    return errCode[code]
  }
}
module.exports = BaseComponent
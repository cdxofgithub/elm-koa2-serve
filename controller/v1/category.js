const captchapng = require("captchapng")

class Captchas {
  async getCaptchas(ctx) {
    const cap = parseInt(Math.random()*9000+1000)
    const p = new captchapng(80,30, cap)
    p.color(0, 0, 0, 0)
    p.color(80, 80, 80, 255)
    const base64 = p.getBase64()
    ctx.session.cap = cap
    // ctx.session.cap.maxAge = Number(300000)
    ctx.body = {
      status: 0,
      data: 'data:image/png;base64,' + base64,
      message: "验证码图片发送成功"
    }
  }
}
module.exports = new Captchas()
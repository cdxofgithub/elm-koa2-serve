const Basecomponent = require('./baseComponent')

class AddressComponent extends Basecomponent{
  constructor() {
    super()
  }
  async guessPosition() {
    return {
      city: "上海"
    }
  }
}

module.exports = AddressComponent
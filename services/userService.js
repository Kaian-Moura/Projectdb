const User = require("../models/User");

const userService = {
  async getUserByEmail(email) {
    return await User.findByEmail(email);
  },
  async createUser(userData) {
    return await User.create(userData);
  },
  // ...outros métodos de serviço podem ser adicionados...
};

module.exports = userService;

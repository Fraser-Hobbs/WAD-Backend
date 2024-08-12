const Enum = require('../utils/enum');

const Roles = Enum.create('volunteer', 'manager', 'admin');

module.exports = Roles;
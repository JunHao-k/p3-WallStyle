const { Role, Account } = require('../models')

const getAllRoles = async () => {
    const roles = await Role.fetchAll().map(role => {
        return [role.get('id'), role.get('account_role')]
    });
    return roles
}

module.exports = { getAllRoles }
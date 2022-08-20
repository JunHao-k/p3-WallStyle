const { Role, Account } = require('../models')
const crypto = require('crypto')


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // The output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const getAllRoles = async () => {
    const roles = await Role.fetchAll().map(role => {
        return [role.get('id'), role.get('account_role')]
    });
    return roles
}

const addCustomerAcct = async (customerData) => {
    const account = new Account()
    customerData.password = getHashedPassword(customerData.password)
    customerData.role_id = 3
    customerData.created_date = new Date()
    customerData.modified_date = new Date()
    account.set(customerData)
    await account.save()

    return account
}

module.exports = { getAllRoles, addCustomerAcct }
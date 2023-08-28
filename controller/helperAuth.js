const User = require('../models/users')
const generateRandomPassword = async () => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
 
        pass += str.charAt(char)
    }
 
    return pass;
}

const loginBodyValidater = async (email, password) => {
    if (!email || !password) {
        return false
    }
    return true
    
}



module.exports = { generateRandomPassword, loginBodyValidater }
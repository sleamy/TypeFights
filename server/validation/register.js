const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    console.log(data)

    data.username = !isEmpty(data.username) ? data.username : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''

    console.log(data)

    if(!Validator.isLength(data.username, { min: 1, max: 20 })) {
        errors.username = 'Username must be less than 20 characters'
    }

    if(Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required'
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required'
    }
    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be between 6 and 30 characters'
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required'
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords do not match'
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required'
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
}
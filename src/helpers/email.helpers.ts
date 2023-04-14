import validator from 'validator'

function isEmailValid(email: string): boolean {
  return validator.isEmail(email)
}

export default isEmailValid

const ERROR_CODES = {
  EMAIL_NOT_FOUND: 'The user with this email was not found',
  INVALID_PASSWORD: 'The password is incorrect',
  EMAIL_EXISTS: 'This email is already in use',
  auth: 'Please log in'
}

export function error (code) {
  return ERROR_CODES[code] ?? 'Unknown error'
}

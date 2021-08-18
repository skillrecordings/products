import {getErrorMessage} from './get-error-message'

test('get error message from error instance', () => {
  const message = getErrorMessage(new Error('this is an error'))

  expect(message).toBe('this is an error')
})

test('get error message from error string', () => {
  const message = getErrorMessage('this is an error from a string')

  expect(message).toBe('this is an error from a string')
})

test('get generic error message non-string or non-error', () => {
  const message = getErrorMessage(true)

  expect(message).toBe('An error has occurred')
})

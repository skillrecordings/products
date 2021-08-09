import Auth from '../index'

test('can create an instance', () => {
  const auth = new Auth()
  expect(auth).not.toBeNull()
})

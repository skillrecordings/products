import cookies from '../index'

test('there is a cookie present', () => {
  cookies.set('test', {})
  expect(cookies.get('test')).not.toBeUndefined()
})

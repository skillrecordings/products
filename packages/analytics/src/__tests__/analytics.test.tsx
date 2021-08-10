import {getLocalUser, USER_KEY} from '../index'

describe('getLocalUser', () => {
  beforeEach(() => {
    global.localStorage.setItem(USER_KEY, '{}')
  })

  test('when set with USER_KEY the object should be defined ', () => {
    expect(getLocalUser()).not.toBeUndefined()
  })
})

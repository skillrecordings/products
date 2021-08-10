import {convertTimeToMins} from '../index'

describe('convertTimeToMins', () => {
  test('converts 60 seconds to 1m', () => {
    const mins = convertTimeToMins(60)
    expect(mins).toBe('1m')
  })
})

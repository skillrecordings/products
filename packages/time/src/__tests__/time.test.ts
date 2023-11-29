import {
  convertTimeToMins,
  convertTime,
  convertTimeWithTitles,
  percentComplete,
  isLessonComplete,
} from '../index'

describe('convertTimeToMins', () => {
  test('converts 60 seconds to 1m', () => {
    const mins = convertTimeToMins(60)
    expect(mins).toBe('1m')
  })
  test('converts 600 seconds to 10m', () => {
    const mins = convertTimeToMins(600)
    expect(mins).toBe('10m')
  })
  test('converts 0 seconds to 0m', () => {
    const mins = convertTimeToMins(0)
    expect(mins).toBe('0m')
  })
  test('negative input has same output as an input of 0', () => {
    const negativeSecondsToMin = convertTimeToMins(-1)
    const zeroSecondsToMin = convertTimeToMins(0)
    expect(negativeSecondsToMin).toBe(zeroSecondsToMin)
  })
})

describe('convertTime', () => {
  test('converts 3600 seconds to 01:00:00', () => {
    const formattedTime = convertTime(3600)
    expect(formattedTime).toBe('01:00:00')
  })
  test('converts 3599 seconds to 59:59', () => {
    const formattedTime = convertTime(3599)
    expect(formattedTime).toBe('59:59')
  })
  test('converts 60 seconds to 01:00', () => {
    const formattedTime = convertTime(60)
    expect(formattedTime).toBe('01:00')
  })
  test('converts 0 seconds to 00:00', () => {
    const formattedTime = convertTime(0)
    expect(formattedTime).toBe('00:00')
  })
  test('negative input has same output as an input of 0', () => {
    const negativeSecondsFormatted = convertTime(-1)
    const zeroSecondsFormatted = convertTime(0)
    expect(negativeSecondsFormatted).toBe(zeroSecondsFormatted)
  })
})

describe('convertTimeWithTitles', () => {
  test('converts 3600 seconds to 1h (default options)', () => {
    const formattedTime = convertTimeWithTitles(3600)
    expect(formattedTime).toBe('1h')
  })

  test('converts 3601 seconds to 1h (default options)', () => {
    const formattedTime = convertTimeWithTitles(3601)
    expect(formattedTime).toBe('1h')
  })

  test('converts 3601 seconds to 1h with showSeconds: true', () => {
    const formattedTime = convertTimeWithTitles(3601, {showSeconds: true})
    expect(formattedTime).toBe('1h')
  })

  test('converts 3660 seconds to 1h 1m (default options)', () => {
    const formattedTime = convertTimeWithTitles(3660)
    expect(formattedTime).toBe('1h 1m')
  })

  test('converts 7199 seconds to 1h 59m (default options)', () => {
    const formattedTime = convertTimeWithTitles(7199)
    expect(formattedTime).toBe('1h 59m')
  })

  test('converts 3599 seconds to 59m (default options)', () => {
    const formattedTime = convertTimeWithTitles(3599)
    expect(formattedTime).toBe('59m')
  })

  test('converts 3599 seconds to 59m 59s with showSeconds: true', () => {
    const formattedTime = convertTimeWithTitles(3599, {showSeconds: true})
    expect(formattedTime).toBe('59m 59s')
  })

  test('converts 30 seconds to an empty string (default options)', () => {
    const formattedTime = convertTimeWithTitles(30)
    expect(formattedTime).toBe('')
  })

  test('converts 30 seconds to 30s with showSeconds: true', () => {
    const formattedTime = convertTimeWithTitles(30, {showSeconds: true})
    expect(formattedTime).toBe('30s')
  })

  test('converts 0 seconds to empty string (default options)', () => {
    const formattedTime = convertTimeWithTitles(0)
    expect(formattedTime).toBe('')
  })

  test('converts 0 seconds to empty string with showSeconds: true', () => {
    const formattedTime = convertTimeWithTitles(0, {showSeconds: true})
    expect(formattedTime).toBe('')
  })

  test('negative input has same output as an input of 0', () => {
    const negativeSecondsFormatted = convertTimeWithTitles(-1)
    const zeroSecondsFormatted = convertTimeWithTitles(0)
    expect(negativeSecondsFormatted).toBe(zeroSecondsFormatted)
  })
})

describe('percentComplete', () => {
  const mockCourse = {
    lessons: [
      {duration: 100, slug: 'lesson-1'},
      {duration: 200, slug: 'lesson-2'},
      {duration: 300, slug: 'lesson-3'},
      {duration: 100, slug: 'lesson-4'},
      {duration: 200, slug: 'lesson-5'},
      {duration: 300, slug: 'lesson-6'},
      {duration: 100, slug: 'lesson-7'},
      {duration: 200, slug: 'lesson-8'},
    ],
  }

  test('returns 0.4 for completion of first 600 seconds out of 1500 seconds', () => {
    const mockCompletedLessons = [
      {slug: 'lesson-1'},
      {slug: 'lesson-2'},
      {slug: 'lesson-3'},
    ]
    const percent = percentComplete(mockCourse, mockCompletedLessons)
    expect(percent).toBe(0.4)
  })

  test('returns 0.4 for completion of non-consecutive 600 seconds out of 1500 seconds', () => {
    const mockCompletedLessons = [
      {slug: 'lesson-2'},
      {slug: 'lesson-5'},
      {slug: 'lesson-8'},
    ]
    const percent = percentComplete(mockCourse, mockCompletedLessons)
    expect(percent).toBe(0.4)
  })

  test('returns 1 for completion of all lessons', () => {
    const mockCompletedLessons = [
      {slug: 'lesson-1'},
      {slug: 'lesson-2'},
      {slug: 'lesson-3'},
      {slug: 'lesson-4'},
      {slug: 'lesson-5'},
      {slug: 'lesson-6'},
      {slug: 'lesson-7'},
      {slug: 'lesson-8'},
    ]
    const percent = percentComplete(mockCourse, mockCompletedLessons)
    expect(percent).toBe(1)
  })

  test('returns 0 for completion of no lessons', () => {
    const mockCompletedLessons: any[] = []
    const percent = percentComplete(mockCourse, mockCompletedLessons)
    expect(percent).toBe(0)
  })
})

describe('isLessonComplete', () => {
  const mockCompletedLessons = [
    {slug: 'lesson-1'},
    {slug: 'lesson-3'},
    {slug: 'lesson-4'},
    {slug: 'lesson-6'},
    {slug: 'lesson-8'},
  ]

  test('returns true for a completed lesson', () => {
    const lessonComplete = isLessonComplete(
      {slug: 'lesson-4'},
      mockCompletedLessons,
    )
    expect(lessonComplete).toBe(true)
  })

  test('returns false for an lesson that has not been completed', () => {
    const lessonComplete = isLessonComplete(
      {slug: 'lesson-9'},
      mockCompletedLessons,
    )
    expect(lessonComplete).toBe(false)
  })
})

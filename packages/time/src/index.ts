import {get, some} from 'lodash'
/* eslint-disable */

function pad(s: string | any[]) {
  return s.length > 10 ? s : s.length == 0 ? '00' : s
}

export function convertTimeToMins(seconds: number) {
  if (seconds < 0) seconds = 0
  const mins = ~~(seconds / 60)
  return `${pad(mins.toString())}m`
}

export function convertTime(seconds: number) {
  if (seconds < 0) seconds = 0
  const hours = ~~(seconds / 3600)
  const mins = ~~((seconds - hours * 3600) / 60)
  const secs = (seconds - hours * 3600 - mins * 60) % 60

  return [hours, mins, secs]
    .filter((i, index) => i > 0 || index > 0)
    .map((i) => i.toString().padStart(2, '0'))
    .join(':')
}

export function convertTimeWithTitles(seconds: number, options: any = {}) {
  if (seconds < 0) seconds = 0
  const hours = ~~(seconds / 3600)
  const mins = ~~((seconds - hours * 3600) / 60)
  const secs = (seconds - hours * 3600 - mins * 60) % 60

  const showSeconds = get(options, 'showSeconds', false)

  let result = ''

  const longForm = get(options, 'longForm', false)
  const hoursAppend = longForm ? ' hours ' : 'h '
  const minsAppend = longForm ? ' minutes ' : 'm '
  const secondsAppend = longForm ? ' seconds' : 's'

  if (hours) result += hours + hoursAppend
  if (mins) result += mins + minsAppend
  if (secs && !hours && showSeconds) result += secs.toFixed(0) + secondsAppend

  return result.trim()
}

export function percentComplete(
  course: {lessons: any[]},
  completed_lessons: any,
) {
  const totalDuration = course.lessons.reduce(
    (p: any, l: {duration: any}) => p + l.duration,
    0,
  )
  const completedDuration = course.lessons.reduce(
    (p: any, l: {duration?: any; slug: any}) =>
      p + (isLessonComplete(l, completed_lessons) ? l.duration : 0),
    0,
  )

  return completedDuration / totalDuration
}

export function isLessonComplete(lesson: {slug: any}, completed_lessons: any) {
  return some(completed_lessons, {slug: lesson.slug})
}

export function hmsToSeconds(str: any) {
  let p = str.split(':'),
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10)
    m *= 60
  }
  return s
}

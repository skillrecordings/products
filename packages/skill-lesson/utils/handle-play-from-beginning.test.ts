import {getRouteQuery, pathnameForPath} from './handle-play-from-beginning'

test('returns proper pathname for path and section', () => {
  const section = {
    _id: 'section-1',
    slug: 'section-1',
    _type: 'section',
    title: 'Section 1',
  }

  const path = 'path'

  const pathname = pathnameForPath({section, path})

  expect(pathname).toEqual('/path/[module]/[section]/[lesson]')
})

test('returns proper pathname for path and no section', () => {
  const path = 'path'

  const pathname = pathnameForPath({path})

  expect(pathname).toEqual('/path/[module]/[lesson]')
})

test('returns proper query for section and module', () => {
  const section = {
    _id: 'section-1',
    slug: 'section-1',
    _type: 'section',
    title: 'Section 1',
    lessons: [
      {
        _id: 'lesson-1',
        slug: 'lesson-1',
        type: 'exercise',
        title: 'Lesson 1',
        _type: 'exercise',
      },
    ],
  }

  const module = {
    _id: 'module-1',
    slug: {
      current: 'module-1',
    },
    _type: 'module',
    title: 'Module 1',
    sections: [section],
    moduleType: 'course',
  }

  const query = getRouteQuery({section, module})

  expect(query).toEqual({
    module: 'module-1',
    section: 'section-1',
    lesson: 'lesson-1',
  })
})

test('returns proper query for no section and module', () => {
  const module = {
    _id: 'module-1',
    slug: {
      current: 'module-1',
    },
    _type: 'module',
    title: 'Module 1',
    moduleType: 'course',
    lessons: [
      {
        _id: 'lesson-1',
        slug: 'lesson-1',
        type: 'exercise',
        title: 'Lesson 1',
        _type: 'exercise',
      },
    ],
  }

  const query = getRouteQuery({module})

  expect(query).toEqual({
    module: 'module-1',
    lesson: 'lesson-1',
  })
})

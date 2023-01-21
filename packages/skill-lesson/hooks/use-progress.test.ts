import {extractExercisesAndResource} from './use-progress'

test('the solution for lesson one to be returned as a resource', () => {
  const {resources} = extractExercisesAndResource(sections)
  expect(resources).toEqual([lessonOneSolution, lessonTwoSolution])
})

test('the all lessons to be returned', () => {
  const {exercises} = extractExercisesAndResource(sections)

  expect(exercises).toEqual([lessonOne, lessonTwo])
})

const lessonOneSolution = {
  _id: 'lesson-1-solution',
  slug: 'lesson-1-solution',
  type: 'solution',
}

const lessonOne = {
  _id: 'lesson-1',
  slug: 'lesson-1',
  type: 'exercise',
  title: 'Lesson 1',
  _type: 'exercise',
  solution: lessonOneSolution,
}

const lessonTwoSolution = {
  _id: 'lesson-2-solution',
  slug: 'lesson-2-solution',
  type: 'solution',
}

const lessonTwo = {
  _id: 'lesson-2',
  slug: 'lesson-2',
  type: 'exercise',
  title: 'Lesson 2',
  _type: 'exercise',
  solution: lessonTwoSolution,
}

const sections = [
  {
    _id: 'section-1',
    slug: 'section-1',
    _type: 'section',
    title: 'Section 1',
    lessons: [lessonOne, lessonTwo],
  },
]

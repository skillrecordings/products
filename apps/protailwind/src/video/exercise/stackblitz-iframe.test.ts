import {getStartCommand} from './stackblitz-iframe'

describe('getStartCommand', () => {
  it.each([
    [
      'exercise',
      'src/02-unions-and-indexing/05-terminology.problem.ts',
      'e-05',
    ],
    ['exercise', 'src/02-terminology.problem.ts', 'e-02'],
    ['exercise', '04-terminology.problem.ts', 'e-04'],
    [
      'solution',
      'src/02-unions-and-indexing/05-terminology.solution.ts',
      's-05',
    ],
    [
      'solution',
      'src/02-unions-and-indexing/07-terminology.solution.2.ts',
      's-07',
    ],
    [
      'solution',
      'src/02-unions-and-indexing/07.1-terminology.solution.2.ts',
      's-07.1',
    ],
  ])(
    `Should calculate the correct start command`,
    (_type, stackblitz, result) => {
      expect(getStartCommand({_type}, stackblitz)).toEqual(result)
    },
  )
})

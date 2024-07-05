import {
  SECTION_NOT_DETECTED,
  getSectionNumFromPath,
  getStartCommand,
} from './stackblitz-iframe'

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
    [
      'exercise',
      'src/009-cannot-redeclare-block-scoped-variable.problem/index.ts',
      'e-009',
    ],
    [
      'exercise',
      'src/04-example/004-another-example.problem/index.ts',
      'e-004',
    ],
  ])(
    `Should calculate the correct start command`,
    (_type, stackblitz, result) => {
      expect(getStartCommand({_type}, stackblitz)).toEqual(result)
    },
  )
})

describe('getSectionNumFromPath', () => {
  it.each([
    ['src/02-unions-and-indexing/05-terminology.problem.ts', '02'],
    ['src/05-terminology.problem.ts', SECTION_NOT_DETECTED],
    ['src/something.ts', SECTION_NOT_DETECTED],
    ['src/05-terminology', SECTION_NOT_DETECTED],
    ['src/02-wonderful/05-terminology', '02'],
    ['src/010-something-else/02-wonderful/05-terminology', '02'],
    ['src/010-something-else/040-wonderful/05-terminology', '040'],
    ['src/040-wonderful-520/05-terminology', '040'],
  ])(`Should calculate the right section number`, (type, result) => {
    expect(getSectionNumFromPath(type)).toEqual(result)
  })
})

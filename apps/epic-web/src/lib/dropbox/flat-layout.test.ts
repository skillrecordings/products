/**
 * Tests for the flat-layout parser.
 *
 * Uses vitest (per the T1 spec). NOTE: at the time of writing, this Epic
 * Web workspace runs jest, not vitest — so these tests don't execute under
 * `pnpm test` until vitest is wired up. The imports are kept on `vitest`
 * deliberately as instructed; the test bodies are framework-agnostic
 * `describe / it / expect` style.
 *
 * Title-handling note: when `opts.workshopName` is provided, intro/outro
 * workshop items use the `"Introduction to {workshopName}"` /
 * `"Outro to {workshopName}"` naming; otherwise the cleaned filename
 * portion is used as the title.
 */

import {describe, it, expect} from 'vitest'
import {parseFlatLayout, type FlatEntry} from './flat-layout'

function entry(name: string, path?: string): FlatEntry {
  return {name, path: path ?? `/workshop/${name}`}
}

describe('parseFlatLayout', () => {
  it('parses a single intro 00-welcome.mp4 and outro 99-thanks.mp4', () => {
    const result = parseFlatLayout([
      entry('00-welcome.mp4'),
      entry('99-thanks.mp4'),
    ])

    expect(result.introItems).toHaveLength(1)
    expect(result.introItems[0]).toMatchObject({
      kind: 'intro-workshop',
      title: 'Welcome',
    })
    expect(result.outroItems).toHaveLength(1)
    expect(result.outroItems[0]).toMatchObject({
      kind: 'outro-workshop',
      title: 'Thanks',
    })
    expect(result.sections).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
  })

  it('pairs problem + solution into one exercise with both fields', () => {
    const result = parseFlatLayout([
      entry('01-00-problem-state.mp4'),
      entry('01-00-solution-state.mp4'),
    ])

    expect(result.warnings).toHaveLength(0)
    expect(result.sections).toHaveLength(1)
    const section = result.sections[0]
    expect(section.position).toBe(1)
    expect(section.items).toHaveLength(1)
    const exercise = section.items[0]
    expect(exercise.kind).toBe('exercise')
    if (exercise.kind === 'exercise') {
      expect(exercise.title).toBe('State')
      expect(exercise.problem.name).toBe('01-00-problem-state.mp4')
      expect(exercise.solution?.name).toBe('01-00-solution-state.mp4')
    }
  })

  it('emits exercise + warning when a problem has no matching solution', () => {
    const result = parseFlatLayout([entry('01-00-problem-state.mp4')])

    expect(result.warnings).toContain(
      'problem without matching solution: 01-00-problem-state.mp4',
    )
    expect(result.sections).toHaveLength(1)
    const exercise = result.sections[0].items[0]
    expect(exercise.kind).toBe('exercise')
    if (exercise.kind === 'exercise') {
      expect(exercise.solution).toBeUndefined()
    }
  })

  it('emits lesson + warning when a solution has no matching problem', () => {
    const result = parseFlatLayout([entry('01-00-solution-state.mp4')])

    expect(result.warnings).toContain(
      'solution without matching problem: 01-00-solution-state.mp4',
    )
    expect(result.sections).toHaveLength(1)
    const item = result.sections[0].items[0]
    expect(item.kind).toBe('lesson')
    if (item.kind === 'lesson') {
      expect(item.entry.name).toBe('01-00-solution-state.mp4')
    }
  })

  it('treats 02-00-intro-fetching.mp4 as section-intro and uses it as the section title', () => {
    const result = parseFlatLayout([
      entry('02-00-intro-fetching.mp4'),
      entry('02-01-lesson-doing-things.mp4'),
    ])

    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].title).toBe('Fetching')
    const intro = result.sections[0].items[0]
    expect(intro.kind).toBe('section-intro')
  })

  it('falls back to "Section 3" when a section has no section-intro', () => {
    const result = parseFlatLayout([entry('03-00-lesson-just-a-thing.mp4')])

    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].position).toBe(3)
    expect(result.sections[0].title).toBe('Section 3')
  })

  it('defaults unknown kinds to lesson with a warning', () => {
    const result = parseFlatLayout([entry('01-02-break-coffee.mp4')])

    expect(result.warnings).toContain(
      "unknown kind 'break' for file '01-02-break-coffee.mp4', defaulted to lesson",
    )
    expect(result.sections).toHaveLength(1)
    const item = result.sections[0].items[0]
    expect(item.kind).toBe('lesson')
    if (item.kind === 'lesson') {
      expect(item.title).toBe('Coffee')
    }
  })

  it('skips unrecognized filenames and emits a warning', () => {
    const result = parseFlatLayout([entry('random.mp4')])

    expect(result.warnings).toContain('unrecognized filename: random.mp4')
    expect(result.introItems).toHaveLength(0)
    expect(result.outroItems).toHaveLength(0)
    expect(result.sections).toHaveLength(0)
  })

  it('sorts items by itemPos and sections by sectionPos regardless of input order', () => {
    const result = parseFlatLayout([
      entry('02-01-lesson-second.mp4'),
      entry('01-02-lesson-b.mp4'),
      entry('01-00-lesson-a.mp4'),
      entry('02-00-intro-section-two.mp4'),
    ])

    expect(result.sections.map((s) => s.position)).toEqual([1, 2])
    const section1Positions = result.sections[0].items.map((it) =>
      'itemPos' in it ? it.itemPos : -1,
    )
    expect(section1Positions).toEqual([0, 2])
    const section2Positions = result.sections[1].items.map((it) =>
      'itemPos' in it ? it.itemPos : -1,
    )
    expect(section2Positions).toEqual([0, 1])
  })

  it('uses workshopName option for intro/outro titles when provided', () => {
    const result = parseFlatLayout(
      [entry('00-welcome.mp4'), entry('99-thanks.mp4')],
      {workshopName: 'Epic React'},
    )

    expect(result.introItems[0].title).toBe('Introduction to Epic React')
    expect(result.outroItems[0].title).toBe('Outro to Epic React')
  })
})

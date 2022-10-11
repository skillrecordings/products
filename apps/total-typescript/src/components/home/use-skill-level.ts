import find from 'lodash/find'

export type SkillLevel = {
  id: string
  title: string
  rank: number
}

function getSkillLevel(level?: string): SkillLevel {
  const skillLevels: SkillLevel[] = [
    {
      id: 'true-beginner',
      rank: 1,
      title: 'True Beginner',
    },
    {
      id: 'beginner',
      rank: 2,
      title: 'Beginner',
    },
    {
      id: 'advanced-beginner',
      rank: 3,
      title: 'Advanced Beginner',
    },
    {
      id: 'intermediate',
      rank: 4,
      title: 'Intermediate',
    },
    {
      id: 'advanced-intermediate',
      rank: 5,
      title: 'Advanced Intermediate',
    },
    {
      id: 'advanced',
      rank: 6,
      title: 'Advanced',
    },
    {
      id: 'expert',
      rank: 7,
      title: 'Expert',
    },
    {
      id: 'superior',
      rank: 8,
      title: 'Superior',
    },
    {
      id: 'wizard',
      rank: 9,
      title: 'Wizard',
    },
    {
      id: 'diety',
      rank: 10,
      title: 'Diety',
    },
  ]

  return find(skillLevels, {id: level}) || skillLevels[1]
}

export function useSkillLevel(level?: string) {
  return getSkillLevel(level)
}

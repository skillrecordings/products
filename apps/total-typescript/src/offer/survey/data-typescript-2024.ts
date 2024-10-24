import {QuizResource} from '@skillrecordings/types'

function getFinalQuestion(answers: Record<string, string>): string {
  const role = answers.role
  const challenge = answers.current_challenge
  const skillLevel = answers.skill_level

  // Team Leader variant
  if (
    (role === 'tech_lead' || role === 'manager') &&
    (challenge === 'team_adoption' ||
      answers.learning_priority === 'team_adoption')
  ) {
    return "We love working with technical leaders who are helping their teams level up with TypeScript! Could you tell us more about your team's TypeScript journey? What specific challenges are you facing with adoption, and what would make the biggest impact for your team right now?"
  }

  // Learning Journey variant
  if (
    skillLevel === 'beginner' ||
    skillLevel === 'advanced-beginner' ||
    challenge === 'fundamentals'
  ) {
    return "Everyone's TypeScript learning journey is unique! Could you tell us about what motivated you to learn TypeScript and what specific concepts or patterns you're most eager to master? What would help you feel more confident using TypeScript in your projects?"
  }

  // Individual Developer variant (default)
  return "It sounds like you're diving deep into TypeScript's technical challenges! Could you share more about the specific problems you're trying to solve? What kinds of TypeScript patterns or solutions would make the biggest difference in your day-to-day work?"
}

export const dataTypescript2024: QuizResource = {
  title: 'TypeScript Developer Survey',
  questions: {
    ts_at_work: {
      question: 'Do you use TypeScript at work?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'true',
          label: 'Yes, I use TypeScript at work.',
        },
        {
          answer: 'false',
          label: 'Nope',
        },
      ],
    },
    skill_level: {
      question: "👋 What's your current TypeScript skill level?",
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'beginner',
          label: 'Beginner',
        },
        {
          answer: 'advanced-beginner',
          label: 'Advanced Beginner',
        },
        {
          answer: 'intermediate',
          label: 'Intermediate',
        },
        {
          answer: 'expert',
          label: 'Expert',
        },
        {
          answer: 'wizard',
          label: 'Wizard',
        },
      ],
    },
    development_focus: {
      question: 'What type of TypeScript development do you primarily do?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'frontend',
          label: 'Frontend (building user interfaces and web apps)',
        },
        {
          answer: 'backend',
          label: 'Backend (building APIs and server-side applications)',
        },
        {
          answer: 'fullstack',
          label: 'Full-stack (both frontend and backend)',
        },
        {
          answer: 'none',
          label: "I don't use TypeScript",
        },
      ],
    },
    role: {
      question: 'Which best describes your role on the team?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'individual',
          label: 'Individual developer (writing code day-to-day)',
        },
        {
          answer: 'tech_lead',
          label: 'Tech lead (guiding technical decisions)',
        },
        {
          answer: 'manager',
          label: 'Engineering manager (leading teams)',
        },
        {
          answer: 'solo',
          label: 'Solo developer/freelancer',
        },
      ],
    },
    tools: {
      question:
        'Which tools are you using with TypeScript? (Choose all that apply)',
      type: 'multiple-choice',
      allowMultiple: true,
      shuffleChoices: false,
      choices: [
        {
          answer: 'react',
          label: 'React',
        },
        {
          answer: 'nextjs',
          label: 'Next.js',
        },
        {
          answer: 'nodejs',
          label: 'Node.js',
        },
        {
          answer: 'express',
          label: 'Express',
        },
        {
          answer: 'nestjs',
          label: 'NestJS',
        },
        {
          answer: 'vanilla',
          label: 'Vanilla TypeScript',
        },
        {
          answer: 'other',
          label: 'Other',
        },
      ],
    },
    current_challenge: {
      question: "What's your biggest TypeScript challenge right now?",
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'types',
          label: 'Writing better types for my code',
        },
        {
          answer: 'complex_types',
          label: 'Managing complex type systems',
        },
        {
          answer: 'setup',
          label: 'Setting up and configuring TypeScript projects',
        },
        {
          answer: 'team_adoption',
          label: 'Getting my team to adopt TypeScript best practices',
        },
        {
          answer: 'advanced_features',
          label: 'Understanding advanced TypeScript features',
        },
        {
          answer: 'debugging',
          label: 'Debugging type-related issues',
        },
      ],
    },
    learning_priority: {
      question: 'What would help you most with TypeScript right now?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'fundamentals',
          label: 'Learning TypeScript fundamentals the right way',
        },
        {
          answer: 'advanced_patterns',
          label: 'Mastering advanced type patterns',
        },
        {
          answer: 'real_world',
          label: 'Building real-world applications with TypeScript',
        },
        {
          answer: 'team_adoption',
          label: 'Leading TypeScript adoption in my team',
        },
        {
          answer: 'specific_problems',
          label: 'Solving specific TypeScript problems at work',
        },
      ],
    },
    final_story: {
      question: getFinalQuestion,
      type: 'essay',
    },
  },
}

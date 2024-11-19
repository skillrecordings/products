import {QuizResource} from '@skillrecordings/types'

export const sortingHat2024: QuizResource = {
  title: 'What Makes A Wizard Quiz',
  questions: {
    quiz_2024_any_usage: {
      question: "How often do you use 'any'?",
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'pragmatic~1',
          label: 'You gotta do what you gotta do',
        },
        {
          answer: 'never~3',
          label: 'Absolutely never',
        },
        {
          answer: 'intentional~5',
          label: 'Whenever I like - I know all the tradeoffs',
        },
      ],
    },
    quiz_2024_types_vs_interfaces: {
      question:
        'One of these statements about types vs interfaces is false. Which one?',
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'performance~5',
          label: 'Interfaces are more performant',
        },
        {
          answer: 'index_signature~1',
          label: 'Types have an implicit index signature',
        },
        {
          answer: 'unions~1',
          label: "Interfaces can't be used to express union types",
        },
      ],
    },
    quiz_2024_npm_confidence: {
      question: 'How confident are you at publishing to NPM?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'terrified~1',
          label: 'It fills me with terror',
        },
        {
          answer: 'uncertain~2',
          label: "I did it once and I'm pretty sure I did it wrong",
        },
        {
          answer: 'comfortable~3',
          label: "I've done it a few times",
        },
        {
          answer: 'expert~5',
          label: 'I eat NPM packages for breakfast',
        },
      ],
    },
    quiz_2024_object_keys: {
      question: 'What type does Object.keys return?',
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'correct~5',
          label: 'An array of strings',
        },
        {
          answer: 'incorrect~2',
          label:
            'An array of strings, typed to the keys of the object passed in',
        },
        {
          answer: 'unknown~1',
          label: "Don't know",
        },
      ],
    },
    quiz_2024_let_const_inference: {
      question: "Do 'let' and 'const' infer differently in TypeScript?",
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'incorrect~2',
          label: 'No, they behave the same',
        },
        {
          answer: 'correct~5',
          label: 'Yes, they behave differently',
        },
        {
          answer: 'unknown~1',
          label: 'No idea',
        },
      ],
    },
    quiz_2024_company_wizard: {
      question: 'Are you the TypeScript wizard at your company?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'novice~1',
          label: "I'm usually the one bothering the wizards",
        },
        {
          answer: 'intermediate~3',
          label: 'I get by OK, but nothing special',
        },
        {
          answer: 'expert~5',
          label: 'My colleagues know I can help fix their TS problems',
        },
      ],
    },
    quiz_2024_object_type: {
      question: "Does TypeScript have 'open' or 'closed' objects?",
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'correct~5',
          label: 'Open',
        },
        {
          answer: 'incorrect~2',
          label: "Closed (sometimes called 'exact')",
        },
        {
          answer: 'unknown~1',
          label: 'No clue',
        },
      ],
    },
    quiz_2024_generics_confidence: {
      question: 'How confident are you with Generics?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'terrified~1',
          label: '*breaks out in a cold sweat*',
        },
        {
          answer: 'basic~2',
          label: 'Types are fine, but generic functions freak me out',
        },
        {
          answer: 'comfortable~3',
          label: "I'm happy in my app's 'utils' folder",
        },
        {
          answer: 'advanced~4',
          label: "I know what 'const T' does",
        },
        {
          answer: 'expert~5',
          label: "I know what 'in/out T' does",
        },
      ],
    },
    quiz_2024_empty_object: {
      question: "Do you know what's special about the empty object type: '{}'?",
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'wrong~1',
          label: 'You can pass any type to it',
        },
        {
          answer: 'incorrect~2',
          label: 'You can pass any object to it',
        },
        {
          answer: 'correct~5',
          label: 'You can pass anything except null or undefined to it',
        },
        {
          answer: 'unknown~1',
          label: 'What even is that',
        },
      ],
    },
    quiz_2024_declare_const: {
      question: "Do you know what 'declare const' does?",
      type: 'multiple-choice',
      shuffleChoices: true,
      choices: [
        {
          answer: 'incorrect~1',
          label: 'Declares a type in the global scope',
        },
        {
          answer: 'correct~5',
          label: "Types a variable that doesn't exist at runtime",
        },
        {
          answer: 'unknown~0',
          label: '¯\\_(ツ)_/¯',
        },
      ],
    },
    quiz_2024_untyped_js: {
      question: 'How do you feel about using untyped JavaScript?',
      type: 'multiple-choice',
      shuffleChoices: false,
      choices: [
        {
          answer: 'js_lover~1',
          label: 'Please, take me back to my untyped happy place',
        },
        {
          answer: 'mixed~2',
          label: 'TypeScript is better, but I miss dynamic typing',
        },
        {
          answer: 'ts_lover~5',
          label: "I'll never go back. TS is life.",
        },
      ],
    },
  },
}

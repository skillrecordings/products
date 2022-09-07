type QuizConfigProps = {
  title?: string
  instructor?: string
  afterCompletionMessages?: {
    [s: string]: {
      default: string
      last: string
    }
  }
  answerSubmitUrl?: string
  questionBodyRenderer?: (question: any) => void
}

export type QuizConfig = {
  afterCompletionMessages: {
    [s: string]: {
      default: string
      last: string
    }
  }
  answerSubmitUrl?: string
  questionBodyRenderer?: (question: any) => void
}

/**
 * Used to configure quiz
 * @param title Site title
 * @default process.env.NEXT_PUBLIC_SITE_TITLE
 * @param instructor Instructor name
 * @default process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME
 * @param answerSubmitUrl API route for submitting user answer
 * @default process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL || '/api/answer'
 * @param questionBodyRenderer e.g. PortableText
 * @default ReactMarkdown
 */
export default function getConfig({
  title = process.env.NEXT_PUBLIC_SITE_TITLE,
  instructor = process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME,
  answerSubmitUrl = process.env.NEXT_PUBLIC_CONVERTKIT_ANSWER_URL ||
    '/api/answer',
  questionBodyRenderer,
  afterCompletionMessages = {
    neutral: {
      default: `Thanks for submitting your answer!\n\nI'll send the next lesson in 5-10 minutes. Check your inbox.\n\n_Thanks,_\n_${instructor}_`,
      last: `Thanks for submitting your answer!\n\nThis was the last lesson from the ${title} email course. We hope you learned something new, and we look forward to sharing more in the future!\n\n_Thanks,_\n_${instructor}_`,
    },
    correct: {
      default: `Nice work. You chose the correct answer!\n\nI'll send the next lesson in 5-10 minutes. Check your inbox.\n\n_Thanks,_\n_${instructor}_`,
      last: `Nice work. You chose the correct answer!\n\nThis was the last lesson from the ${title} email course. We hope you learned something new, and I look forward to sharing more in the future!\n\n_Thanks,_\n_${instructor}_`,
    },
    incorrect: {
      default: `You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! 👍\n\nI'll send the next email in 5-10 minutes too so you can learn more.\n\n_Thanks,_\n_${instructor}_`,
      last: `You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! 👍\n\nThis was the last lesson from the ${title} email course. We hope you learned something new, and I look forward to sharing more in the future!\n\n_Thanks,_\n_${instructor}_`,
    },
  },
}: QuizConfigProps): QuizConfig {
  return {
    answerSubmitUrl,
    afterCompletionMessages,
    questionBodyRenderer,
  }
}

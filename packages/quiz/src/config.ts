export type QuizConfig = {
  afterCompletionMessages: {
    [s: string]: {
      default: string
      last: string
    }
  }
}

export default function getConfig(
  PRODUCT_TITLE: string,
  AUTHOR: string,
): QuizConfig {
  return {
    afterCompletionMessages: {
      neutral: {
        default: `Thanks for submitting your answer!\n\nI'll send the next lesson in 5-10 minutes. Check your inbox.\n\n_Thanks,_\n_${AUTHOR}_`,
        last: `Thanks for submitting your answer!\n\nThis was the last lesson from the ${PRODUCT_TITLE} email course. We hope you learned something new, and we look forward to sharing more in the future!\n\n_Thanks,_\n_${AUTHOR}_`,
      },
      correct: {
        default: `Nice work. You chose the correct answer!\n\nI'll send the next lesson in 5-10 minutes. Check your inbox.\n\n_Thanks,_\n_${AUTHOR}_`,
        last: `Nice work. You chose the correct answer!\n\nThis was the last lesson from the ${PRODUCT_TITLE} email course. We hope you learned something new, and I look forward to sharing more in the future!\n\n_Thanks,_\n_${AUTHOR}_`,
      },
      incorrect: {
        default: `You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! 👍\n\nI'll send the next email in 5-10 minutes too so you can learn more.\n\n_Thanks,_\n_${AUTHOR}_`,
        last: `You chose an incorrect answer, but don't worry. Just go back and re-read the email and check out any linked resources. You can refresh the page if you'd like to try again! 👍\n\nThis was the last lesson from the ${PRODUCT_TITLE} email course. We hope you learned something new, and I look forward to sharing more in the future!\n\n_Thanks,_\n_${AUTHOR}_`,
      },
    },
  }
}

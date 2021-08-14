import Airtable from 'airtable'
import removeMarkdown from 'remove-markdown'
import isArray from 'lodash/isArray'
import toString from 'lodash/toString'

export default function sendAnswerToAirtable(
  answer: string | null,
  user: any,
  question: string,
) {
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: `${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`,
  })
  const base = Airtable.base(`${process.env.NEXT_PUBLIC_AIRTABLE_BASE}`)
  const now = new Date()

  answer &&
    base('email quiz').create([
      {
        fields: {
          Name: `${user.subscriber.first_name} <${user.subscriber.email_address}>`,
          Answer: isArray(answer) ? toString(answer) : answer,
          Question: removeMarkdown(question),
          Email: user.subscriber.email_address,
          Added: now.toISOString(),
        },
      },
    ])
}

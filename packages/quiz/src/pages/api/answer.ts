import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import toLower from 'lodash/toLower'
import {CONVERTKIT_BASE_URL} from '@skillrecordings/config'
import {fetchConvertkitSubscriberFromServerCookie} from '@skillrecordings/convertkit-react-ui'

if (!CONVERTKIT_BASE_URL)
  throw new Error('No Convertkit API Base Url Found: CONVERTKIT_BASE_URL')

if (!process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN)
  throw new Error('No Convertkit Token Found: NEXT_PUBLIC_CONVERTKIT_TOKEN')

const answer: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    try {
      const {tagId, survey} = req.body
      const cookieHeader = req.headers.cookie as string
      const [subscriber, ckCookie] =
        await fetchConvertkitSubscriberFromServerCookie(cookieHeader)
      const questionId = toLower(survey.id)

      // Subscribe user to tag
      if (tagId) {
        await convertkitAxios.post(`/tags/${tagId}/subscribe`, {
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
          email: subscriber.email_address,
        })
      }

      // Create question field if it doesn't exist
      const fieldExists = !isEmpty(
        find(Object.keys(subscriber.fields), (field) => field === questionId),
      )
      if (!fieldExists) {
        await convertkitAxios.post(`/custom_fields`, {
          api_secret: process.env.CONVERTKIT_API_SECRET,
          label: questionId,
        })
      }

      // Submit user answer
      await convertkitAxios.put(`/subscribers/${subscriber.id}`, {
        api_secret: process.env.CONVERTKIT_API_SECRET,
        fields: {[questionId]: survey.answer},
      })

      res.setHeader('Set-Cookie', ckCookie)
      res.setHeader('Cache-Control', 'max-age=10')
      res.status(200).json(subscriber)
    } catch (error) {
      console.log(error)
      res.status(200).end()
    }
  } else {
    console.error('non-post request made')
    res.status(404).end()
  }
}

/**
 * @deprecated use skill-api instead
 */
export default answer

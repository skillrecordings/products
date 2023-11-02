import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {getCurrentAbility, UserSchema} from '@skillrecordings/skill-lesson'
import {getSignedUrlForVideoFile} from '@skillrecordings/skill-lesson/lib/get-signed-url'

const signedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const token = await getToken({req})
    const ability = getCurrentAbility({user: UserSchema.parse(token)})

    if (ability.can('create', 'Content')) {
      const {objectName} = req.query

      const signedUrl = await getSignedUrlForVideoFile({
        filename: objectName as string,
      })

      if (signedUrl) {
        res.json(signedUrl)
      } else {
        res.status(500).end()
      }
    } else {
      res.status(403).end()
    }
  }
}

export default signedUrl

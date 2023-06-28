import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {getCurrentAbility, UserSchema} from '@skillrecordings/skill-lesson'
import {v2 as cloudinary} from 'cloudinary'

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const signedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const token = await getToken({req})
      const ability = getCurrentAbility({user: UserSchema.parse(token)})
      const {fileName} = req.query
      if (ability.can('create', 'Content')) {
        const timestamp = Math.round(new Date().getTime() / 1000)

        const signature = cloudinary.utils.api_sign_request(
          {
            timestamp: timestamp,
            public_id: String(fileName).split('.')[0],
            folder: process.env.CLOUDINARY_VIDEO_BUCKET_NAME,
          },
          process.env.CLOUDINARY_API_SECRET,
        )

        return res.json({
          timestamp,
          signature,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          folderName: process.env.CLOUDINARY_VIDEO_BUCKET_NAME,
        })
      } else {
        res.status(403).end()
      }
    }
  } catch (error) {
    res.status(404).end()
  }
}

export default signedUrl

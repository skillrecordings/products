import {NextApiRequest, NextApiResponse} from 'next'
import {v2 as cloudinary} from 'cloudinary'
import qs from 'query-string'
import slugify from 'slugify'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {user = 'kit', title, folder = 'kit'} = req.query
  cloudinary.config({
    cloud_name: 'johnlindquist',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  })

  const public_id = slugify(title as string, {
    lower: true,
  })

  const source = `https://${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api/opengraph?${qs.stringify(req.query)}`

  console.log({source})

  const response = await cloudinary.uploader.upload(source, {
    folder: `${folder}/${slugify(user as string, {
      lower: true,
    })}`,
    public_id,
    overwrite: false,
  })

  console.log(response)

  // res.redirect(response.url)
  res.writeHead(302, {
    'Content-type': 'image/png',
    Location: response.url,
    //add other headers here...
  })

  res.end()
}

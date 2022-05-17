import {NextApiRequest, NextApiResponse} from 'next'
import {v2 as cloudinary} from 'cloudinary'
import qs from 'query-string'
import slugify from 'slugify'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user = 'escuela-frontend-opengraph',
    title,
    folder = 'escuela-frontend-opengraph',
  } = req.query
  cloudinary.config({
    cloud_name: 'escuela-frontend',
    api_key: '121744823114119',
    api_secret: 'i7EIJflvGyw_roIgFhS6iP73jRM',
  })

  const public_id = slugify(title as string, {
    lower: true,
  })

  const source = `http://localhost:3011/api/opengraph?${qs.stringify(
    req.query,
  )}`

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

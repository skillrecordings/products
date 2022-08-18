import {NextApiRequest, NextApiResponse} from 'next'
import AWS from 'aws-sdk'
import {getToken} from 'next-auth/jwt'

const accessKeyID = process.env.AWS_CLOUDFRONT_ACCESS_KEY_ID
const privateKeyContents = process.env.AWS_CLOUDFRONT_SIGNING_PEM
const cfDomainName = process.env.AWS_CLOUDFRONT_DOMAIN
const s3ContentPath = process.env.AWS_CLOUDFRONT_BOOK_PATH
const cfFullPath = `${cfDomainName}/${s3ContentPath}`
let signer = new AWS.CloudFront.Signer(accessKeyID, privateKeyContents)

const option = {
  url: cfFullPath,
  expires: Math.floor(new Date().getTime()) + 60 * 60 * 24, // 24 hours from now
}

async function getSignedUrl() {
  return new Promise((resolve, reject) => {
    signer.getSignedUrl(option, (error, url) => {
      if (error) {
        reject(error)
      } else {
        resolve(url)
      }
    })
  })
}

const subscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const token = await getToken({req})
      if (token) {
        const url = await getSignedUrl()
        res.status(200).json({url})
      } else {
        res.status(404).end()
      }
    } catch (error) {
      console.log(error)
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default subscriber

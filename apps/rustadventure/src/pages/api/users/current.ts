import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getTokenFromCookieHeaders, AUTH_DOMAIN} from 'utils/auth'
import getDevAccessToken from 'utils/get-dev-access-token'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  const devToken = getDevAccessToken()
  if (req.method === 'GET' && eggheadToken) {
    const domain = devToken ? 'https://app.egghead.io/' : AUTH_DOMAIN
    const token = devToken ? devToken : eggheadToken

    await axios
      .get(
        `${domain}/api/v1/users/current?minimal=${
          req.query.minimal === 'true'
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({data}) => {
        if (devToken) {
          console.info(`Fetched ${data.email} with access token`)
        }
        res.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate')
        res.status(200).json(data)
      })
      .catch((error) => {
        console.error(error)
        res.status(error.response.status).end(error.response.statusText)
      })
  } else {
    res.status(200).end()
  }
}

export default current

import {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const response = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testing Accessibility Login Redirect</title>
    <script>
      const url = new URL(window.location.href)
      url.pathname = "/api/auth/callback/email"
      window.location.href = url.href
    </script>
  </head>
  <body>
    <div class="page">Redirecting to login...</div>
  </body>
</html> 
`
      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(response)
    } catch (error) {
      console.log(error)
      res.status(200).end()
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default withSentry(callback)

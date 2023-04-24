import {NextApiRequest, NextApiResponse} from 'next'

import axios from 'axios'
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {action, comment, discussion} = req.body

  if (['edited', 'created', 'deleted'].includes(action) && !comment) {
    console.log({
      action,
      discussion,
    })
    if (discussion?.category?.name === 'Docs') {
      let requestOptions = {
        headers: {
          Authorization: `token ${process.env.WORKFLOW_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
      const response = await axios.post(
        `https://api.github.com/repos/johnlindquist/kit-docs/actions/workflows/15293663/dispatches`,
        {ref: 'main'},
        requestOptions,
      )

      res.send(response.data)
    } else {
      const response = await axios.post(
        process.env.KIT_NEW_DISCUSSION_DEPLOY_HOOK as string,
        {},
      )

      res.send(response.data)
    }
  } else {
    res.send(req.body)
  }
}

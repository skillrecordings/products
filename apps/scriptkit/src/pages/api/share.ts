import axios from 'axios'
export default async (req: any, res: any) => {
  let config = {
    headers: {
      Authorization: 'Bearer ' + process.env.GIST_TOKEN,
    },
  }

  const response = await axios.post(
    `https://api.github.com/gists`,
    req.body,
    config,
  )

  res.status = 200
  res.send(response.data)
}

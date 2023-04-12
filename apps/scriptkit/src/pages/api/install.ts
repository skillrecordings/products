//https://raw.githubusercontent.com/johnlindquist/kit/main/config/install.sh

import axios from 'axios'
export default async (req: any, res: any) => {
  const response = await axios.get(
    `https://raw.githubusercontent.com/johnlindquist/kit/main/config/install.sh`,
    req.body,
  )

  res.status = 200
  res.send(response.data)
}

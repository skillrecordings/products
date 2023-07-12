// Next.js API route to check if user is a sponsor
import {NextApiRequest, NextApiResponse} from 'next'
import {init, track, Types} from '@amplitude/analytics-node'

init(process.env.AMPLITUDE_API_KEY as string, {
  logLevel: Types.LogLevel.Debug,
})

type TrackPayload = {
  event: string
  properties: any
  device: {
    device_id: string
  }
}

const trackRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get track event and properties from request body
  const {event, properties, device}: TrackPayload = req.body
  console.debug(`track ${event}`, properties, device)

  // Timeout in ms
  const timeout = 400

  const trackPromise = track(event, properties, device).promise

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout),
  )

  const response = await Promise.race([trackPromise, timeoutPromise]).catch(
    (err) => {
      console.error(err)
      res.status(500).json({error: err.message})
    },
  )

  if (response) {
    res.status(200).json(response)
  }
}

export default trackRoute

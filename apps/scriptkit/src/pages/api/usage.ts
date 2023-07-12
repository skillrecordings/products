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

const trackRoute = (req: NextApiRequest, res: NextApiResponse) => {
  // Get track event and properties from request body
  const {event, properties, device}: TrackPayload = req.body
  console.debug(`track ${event}`, properties, device)

  // Start the track request but don't wait for it
  track(event, properties, device).promise.catch((err) => {
    console.error(err)
  })

  // Immediately send back a success status
  res.status(200).json({message: 'Track request started'})
}

export default trackRoute

/**
 * Support Platform Integration API Route
 *
 * Handles webhook requests from the support platform to perform
 * user lookups, purchase queries, and support actions.
 *
 * Uses HMAC-SHA256 signature verification via the SDK handler.
 */
import type {NextApiRequest, NextApiResponse} from 'next'
import {createSupportHandler} from '@skillrecordings/sdk/handler'
import {integration} from '@/lib/support-integration'

// Create the Web API handler from the SDK
const webHandler = createSupportHandler({
  integration,
  webhookSecret: process.env.SUPPORT_WEBHOOK_SECRET!,
})

/**
 * Read raw request body
 */
async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/**
 * Convert NextApiRequest to Web Request
 */
async function toWebRequest(
  req: NextApiRequest,
  rawBody: string,
): Promise<Request> {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host || 'localhost:3016'
  const url = `${protocol}://${host}${req.url}`

  return new Request(url, {
    method: req.method || 'POST',
    headers: new Headers(req.headers as Record<string, string>),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? rawBody : undefined,
  })
}

/**
 * Send Web Response through NextApiResponse
 */
async function sendWebResponse(
  webResponse: Response,
  res: NextApiResponse,
): Promise<void> {
  res.status(webResponse.status)

  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  const body = await webResponse.text()
  res.send(body)
}

/**
 * Next.js Pages Router API handler
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({error: 'Method not allowed'})
  }

  try {
    // Read raw body for signature verification
    const rawBody = await getRawBody(req)

    // Convert to Web Request
    const webRequest = await toWebRequest(req, rawBody)

    // Call the SDK handler
    const webResponse = await webHandler(webRequest)

    // Convert back to Next.js response
    await sendWebResponse(webResponse, res)
  } catch (error) {
    console.error('[support-api] Handler error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({error: `Internal error: ${message}`})
  }
}

// Disable body parsing - we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

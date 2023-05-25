import handleCreateOgImage from 'server/og-image.server'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  return handleCreateOgImage(req)
}

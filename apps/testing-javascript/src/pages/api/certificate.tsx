import handleCreateCertificate from 'server/certificate.server'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  return handleCreateCertificate(req)
}

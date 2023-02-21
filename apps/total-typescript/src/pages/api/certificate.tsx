import handleCreateCertificate from 'certificate/certificate-handler.server'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  return handleCreateCertificate(req)
}

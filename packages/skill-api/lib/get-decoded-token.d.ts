import {NextApiRequest} from 'next'
export declare function getDecodedToken(
  req: NextApiRequest,
): Promise<import('next-auth/jwt').JWT | null>

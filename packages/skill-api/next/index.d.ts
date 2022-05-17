import type {NextApiRequest, NextApiResponse} from 'next'
import type {PrismaClient} from '@prisma/client'
/** Extract the host from the environment */
export declare function detectHost(forwardedHost: any): any
declare function SkillRecordings(options: SkillRecordingsOptions): any
declare function SkillRecordings(
  req: NextApiRequest,
  res: NextApiResponse,
  options: SkillRecordingsOptions,
): any
export interface SkillRecordingsOptions {
  prismaClient: PrismaClient
}
export default SkillRecordings

import {SkillRecordingsRequest, SkillRecordingsResponse} from '../core/types'
import {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@prisma/client'
/** Extract the host from the environment */
export declare function detectHost(forwardedHost: any): any
declare function SkillRecordings(
  ...args:
    | [SkillRecordingsOptions]
    | [NextApiRequest, NextApiResponse, SkillRecordingsOptions]
):
  | Promise<void | NextApiResponse<any>>
  | ((
      req: SkillRecordingsRequest,
      res: SkillRecordingsResponse,
    ) => Promise<void | NextApiResponse<any>>)
export interface SkillRecordingsOptions {
  prismaClient: PrismaClient
}
export default SkillRecordings

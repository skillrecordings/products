import {SkillRecordingsHandlerParams} from '../types'
import {JWT} from 'next-auth/jwt'
import {OutgoingResponse} from '../index'
import {getSignedUrlForVideoFile} from '../lib/get-signed-url'

export async function signs3UploadUrl({
  params,
  token,
}: {
  params: SkillRecordingsHandlerParams
  token: JWT | null
}): Promise<OutgoingResponse> {
  if (params.options.getAbility) {
    const ability = await params.options.getAbility(params.req)

    if (!ability.can('create', 'Content')) {
      return {
        status: 403,
      }
    }

    const {filename} = params.req.query

    const signedUrl = await getSignedUrlForVideoFile({
      filename: filename as string,
    })

    return {
      status: 200,
      body: signedUrl,
    }
  } else {
    return {
      status: 403,
    }
  }
}

import {z} from 'zod'
import {IncomingRequest, OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {createVerificationUrl} from '../../server'

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

const requireSkillSecret = (req: IncomingRequest): void => {
  try {
    const verifySkillSecretHeader = z
      .object({skillSecretInHeader: z.string(), skillSecret: z.string()})
      .transform(({skillSecretInHeader, skillSecret}, ctx) => {
        if (skillSecret !== skillSecretInHeader)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Unauthorized request to skill-api',
          })
      })

    verifySkillSecretHeader.parse({
      skillSecretInHeader: req.headers['x-skill-secret'],
      skillSecret: process.env.SKILL_SECRET,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new AuthorizationError(error.message)
    }

    throw error
  }
}

export async function createMagicLink({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {req} = params
    requireSkillSecret(req)

    const {email, expiresIn} = z
      .object({email: z.string(), expiresIn: z.coerce.number().optional()})
      .parse(req.query)

    const {nextAuthOptions} = params.options

    let expiresAt: Date | undefined = undefined

    if (expiresIn) {
      const durationInMilliseconds = expiresIn * 1000
      expiresAt = new Date(Date.now() + durationInMilliseconds)
    }

    const verificationDetails = await createVerificationUrl({
      email,
      nextAuthOptions,
      expiresAt,
    })

    if (!verificationDetails) {
      return {
        status: 200,
        body: {message: 'Unable to create the verification URL'},
      }
    }

    return {
      status: 200,
      body: {
        url: verificationDetails.url,
      },
    }
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return {
        status: 401,
        body: {
          error: 'Unauthorized',
        },
      }
    } else {
      return {
        status: 500,
        body: {error: true, message: error.message},
      }
    }
  }
}

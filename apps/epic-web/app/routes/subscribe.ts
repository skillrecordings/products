import type {ActionFunction} from '@remix-run/node'
import {redirect} from '@remix-run/node'
import {subscribeToForm} from '@skillrecordings/convertkit-sdk'
import {z} from 'zod'

const FORM_ID = '3547851'

export const action: ActionFunction = async ({request}) => {
  const formPayload = Object.fromEntries(await request.formData())

  const validationSchema = z.object({
    first_name: z.string(),
    email: z.string().email(),
  })

  try {
    const validatedSchema = validationSchema.parse(formPayload)
    console.log({validatedSchema})
    await subscribeToForm({...validatedSchema, formId: FORM_ID})
    return redirect(`/confirmed`)
  } catch (error) {
    return {
      formPayload,
      error,
    }
  }
  return {} as any
}

import type {ActionFunction, LoaderFunction} from '@remix-run/node';
import { redirect, json} from '@remix-run/node'
import {z} from 'zod'
import {subscribeToForm} from '../lib/convertkit.server'
import {Form, useLoaderData} from '@remix-run/react'
import {convertkitSubscriberCookie} from '~/cookies'

const FORM_ID = '3547851'

export const loader: LoaderFunction = async ({request}) => {
  const cookieHeader = request.headers.get('Cookie')
  const ckSubscriber =
    (await convertkitSubscriberCookie.parse(cookieHeader)) || {}

  return json({ckSubscriber})
}

export const action: ActionFunction = async ({request}) => {
  const formPayload = Object.fromEntries(await request.formData())

  const validationSchema = z.object({
    first_name: z.string(),
    email: z.string().email(),
  })

  try {
    const validatedSchema = validationSchema.parse(formPayload)
    const subscriber = await subscribeToForm({
      ...validatedSchema,
      formId: FORM_ID,
    })

    return redirect(`/confirmed`, {
      headers: {
        'Set-Cookie': await convertkitSubscriberCookie.serialize(subscriber),
      },
    })
  } catch (error) {
    console.error(`form not submitted ${error}`)
    return redirect(`/?error=form-not-submitted`)
  }
}

export default function Index() {
  const {ckSubscriber} = useLoaderData()
  console.log({ckSubscriber})
  return (
    <div className="prose">
      <h1>Welcome to Epic Web Dev</h1>
      <div>
        <Form
          method="post"
          className="flex flex-col w-full max-w-[340px] mx-auto"
        >
          <label>
            Name:{' '}
            <input
              name="first_name"
              type="text"
              placeholder="Preferred name"
              className="block mb-4 w-full px-4 py-3 border placeholder-opacity-60 bg-opacity-50 rounded-lg shadow sm:text-base sm:leading-6"
            />
          </label>

          <label className="font-medium pb-1 inline-block">
            Email:{' '}
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="block mb-4 w-full px-4 py-3 border placeholder-opacity-60 bg-opacity-50 rounded-lg shadow sm:text-base sm:leading-6"
            />
          </label>

          <button
            type="submit"
            className="pt-4 pb-5 mt-4 flex items-center justify-center rounded-lg text-black bg-yellow-500 hover:bg-opacity-100 transition font-bold text-lg focus-visible:ring-yellow-200 hover:scale-105 hover:-rotate-1 hover:bg-yellow-400"
          >
            Create
          </button>
        </Form>
      </div>
    </div>
  )
}

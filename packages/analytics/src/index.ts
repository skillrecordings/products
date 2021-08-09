// lint me
import {isFunction, isUndefined} from 'lodash'
import {Viewer} from '@skillrecordings/types'
const DEBUG_ANALYTICS = false

export const USER_KEY = process.env.NEXT_PUBLIC_USER_KEY || 'user'
export const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'access_token'

export function getLocalUser() {
  if (typeof localStorage === 'undefined') {
    return
  }
  const user = localStorage.getItem(USER_KEY)
  if (user) {
    return JSON.parse(user)
  }
}

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

export const track = (
  event: string,
  paramsOrCallback?: any,
  callback?: any,
) => {
  return new Promise(async (resolve) => {
    const ahoy = window.ahoy
    let wasCalled = false

    const viewer: Viewer = getLocalUser()

    function politelyExit() {
      DEBUG_ANALYTICS && console.debug(`TRACKED: ${event}`)
      if (isFunction(callback) && !wasCalled) {
        wasCalled = true
        callback.apply(null, [event, wasCalled])
      }
      resolve(true)
    }

    const params = isFunction(paramsOrCallback) ? {} : paramsOrCallback
    const timeout = 1250

    if (isUndefined(callback) && isFunction(paramsOrCallback)) {
      callback = paramsOrCallback
    }

    const store = console.error

    console.error = () => {}

    setTimeout(politelyExit, timeout)

    console.error = store

    if (ahoy && isFunction(ahoy.track)) {
      ahoy.track(event, params)
    }

    if (window.fbq) {
      window.fbq('trackCustom', event, params)
    }

    if (window.ga) {
      window.ga('send', {
        hitType: 'event',
        eventAction: event,
      })
    }

    if (
      viewer &&
      !viewer.opted_out &&
      viewer.contact_id &&
      viewer.email &&
      window._cio &&
      isFunction(window._cio.track)
    ) {
      identify(viewer)
      window._cio.track(event, params)
    }

    politelyExit()
  })
}

export const identify = (data: Viewer, properties?: any) => {
  if (
    !data.opted_out &&
    data.email &&
    data.contact_id &&
    window._cio &&
    isFunction(window._cio.identify)
  ) {
    window._cio.identify({
      id: data.contact_id,
      email: data.email,
      first_name: data.name,
      pro: data.is_pro,
      instructor: data.is_instructor,
      created_at: data.created_at,
      discord_id: data.discord_id,
      timezone: data.timezone,
      ...properties,
    })
  }
  return Promise.resolve(data)
}

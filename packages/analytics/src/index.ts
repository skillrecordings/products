import {isFunction, isUndefined} from 'lodash'
import {pageview, event as gaEvent, GoogleSnippet} from './ga'
import {usePageview} from './use-pageview'

const DEBUG_ANALYTICS = false

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
    gtag: any
  }
}

const track = (event: string, paramsOrCallback?: any, callback?: any) => {
  return new Promise(async (resolve) => {
    const ahoy = window.ahoy
    let wasCalled = false

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

    gaEvent({action: event, params})

    if (window.ga) {
      window.ga('send', {
        hitType: 'event',
        eventAction: event,
      })
    }

    politelyExit()
  })
}

export {track, gaEvent, pageview, usePageview, GoogleSnippet}

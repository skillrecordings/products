import Router from 'next/router'
import NProgress from 'nprogress'

export function initNProgress() {
  let timer: any
  const delay = 500
  NProgress.configure({showSpinner: false, trickleSpeed: 100})

  const handleStartLoading = () => {
    timer = setTimeout(() => {
      NProgress.start()
    }, delay)
  }

  const handleStopLoading = () => {
    clearTimeout(timer)
    NProgress.done()
  }

  Router.events.on('routeChangeStart', handleStartLoading)
  Router.events.on('routeChangeComplete', handleStopLoading)
  Router.events.on('routeChangeError', handleStopLoading)
}

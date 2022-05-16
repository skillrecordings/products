

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.init = init

async function init({userOptions, action, host, cookies: reqCookies, isPost}) {
  const options = {
    ...userOptions,
    action,
    debug: false,
    pages: {},
    theme: {
      colorScheme: 'auto',
      logo: '',
      brandColor: '',
    },
  }
  const cookies = []
  return {
    options,
    cookies,
  }
}

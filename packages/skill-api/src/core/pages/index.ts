import renderToString from 'preact-render-to-string'
import TestPage from './sample'
import {InternalOptions} from '../types'
import {IncomingRequest, OutgoingResponse} from '../index'

type RenderPageParams = {
  query?: IncomingRequest['query']
  cookies?: any[]
} & Partial<Pick<InternalOptions, 'url' | 'theme'>>

function css() {
  return ''
}

export default function renderPage(params: RenderPageParams) {
  const {url, theme, query, cookies} = params

  function send({html, title, status}: any): OutgoingResponse {
    return {
      cookies,
      status,
      headers: [{key: 'Content-Type', value: 'text/html'}],
      body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><title>${title}</title></head><body class="__skillrecordings-theme-${
        theme?.colorScheme ?? 'auto'
      }"><div class="page">${renderToString(html)}</div></body></html>`,
    }
  }

  return {
    test(props?: any) {
      return send({
        status: 200,
        html: TestPage({
          theme,
          ...query,
          ...props,
        }),
        title: 'Test Page',
      })
    },
  }
}

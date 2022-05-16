import {InternalOptions} from '../types'
import {IncomingRequest, OutgoingResponse} from '../index'
declare type RenderPageParams = {
  query?: IncomingRequest['query']
  cookies?: any[]
} & Partial<Pick<InternalOptions, 'url' | 'theme'>>
export default function renderPage(params: RenderPageParams): {
  test(props?: any): OutgoingResponse<any>
}
export {}

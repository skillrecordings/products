import {Theme} from '../types'
export declare type TestErrorTypes = 'default'
export interface TestServerPageParams {
  theme: Theme
}
export default function TestPage(props: TestServerPageParams): JSX.Element

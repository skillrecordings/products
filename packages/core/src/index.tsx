import * as React from 'react'
import useConvertkit from './hooks/use-convertkit'
import {useCommerceMachine} from './hooks/use-commerce-machine'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

export {useConvertkit, useCommerceMachine}

// src/pages/_app.tsx
import '../styles/globals.css'
import type {AppType} from 'next/app'
import {trpc} from '../utils/trpc'
import {FrontProvider} from '../context/front-context'

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <FrontProvider>
      <Component {...pageProps} />
    </FrontProvider>
  )
}

export default trpc.withTRPC(MyApp)

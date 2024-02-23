import * as React from 'react'
import App from './app'
import {AppProvider} from './provider'

const Demo = () => (
  <AppProvider>
    <App />
  </AppProvider>
)

export default Demo

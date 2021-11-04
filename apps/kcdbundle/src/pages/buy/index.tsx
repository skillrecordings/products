import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import config from 'config'

import Purchase from '../../components/commerce/purchase'

const Buy: FunctionComponent = () => {
  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}} noFooter>
      <div className="w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center px-5">
        <Purchase />
      </div>
    </Layout>
  )
}

export default Buy

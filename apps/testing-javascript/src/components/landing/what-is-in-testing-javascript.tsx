import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'
import type {SanityDocument} from '@sanity/client'
import Balancer from 'react-wrap-balancer'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

import Playlist from 'components/playlist'

const WhatIsInTestingJavascript: React.FunctionComponent<{
  mostValuedProduct: SanityProduct
  playlists: SanityDocument[]
  canViewContent: boolean
  className?: string
}> = ({mostValuedProduct, playlists, canViewContent, className}) => {
  const purchasedModulesSlugs: string[] =
    mostValuedProduct?.modules.map((module) => {
      return module?.slug
    }) || []
  const purchasedPlaylists = playlists.filter((playlist) =>
    purchasedModulesSlugs.includes(playlist.slug.current),
  )
  const nonPurchasedPlaylists = playlists.filter(
    (playlist) => !purchasedModulesSlugs.includes(playlist.slug.current),
  )
  return (
    <section className={cx(className)}>
      <div className="flex flex-col items-center">
        {!canViewContent && (
          <div className="flex flex-col items-center mb-16 md:mb-20 lg:mb-24">
            <Image
              src="/images/illos/code-bits-1.png"
              alt="Code Bits"
              width={300}
              height={83}
            />
            <h2 className="text-center font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-6 lg:mt-14 max-w-2xl">
              <Balancer>What's in Testing JavaScript?</Balancer>
            </h2>
            <h3 className="font-tt-regular text-center text-xl md:text-2xl opacity-70 mt-4 md:mt-8">
              {playlists.length} modules full of dense testing knowledge
            </h3>
          </div>
        )}

        <ul className="space-y-16 md:space-y-20 lg:space-y-24 w-full">
          {purchasedPlaylists.map((playlist) => {
            return (
              <Playlist
                key={playlist._id}
                playlist={playlist}
                purchased={true}
              />
            )
          })}
          {nonPurchasedPlaylists.map((playlist) => {
            return (
              <Playlist
                key={playlist._id}
                playlist={playlist}
                purchased={false}
              />
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default WhatIsInTestingJavascript

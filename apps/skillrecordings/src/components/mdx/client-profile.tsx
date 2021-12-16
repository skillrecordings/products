import * as React from 'react'
import {Contributor} from '@types'
import Image from 'next/image'

type ClientProfileProps = {
  client: Contributor
}

const ClientProfileBox: React.FC<ClientProfileProps> = ({client, children}) => {
  const {name, label, image} = client

  return (
    <div className="not-prose flex sm:flex-row flex-col items-center sm:space-x-5 sm:space-y-0 space-y-5 sm:text-left text-center py-4">
      <div className="max-w-[160px] w-full rounded-md overflow-hidden flex items-center justify-center">
        <Image placeholder="blur" src={image} alt={name} />
      </div>
      <div className="">
        <div className="text-2xl font-semibold">{name}</div>
        <div className="opacity-90 text-base">{label}</div>
        {children}
      </div>
    </div>
  )
}

export default ClientProfileBox

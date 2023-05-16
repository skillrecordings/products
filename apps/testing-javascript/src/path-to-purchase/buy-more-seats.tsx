import React from 'react'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import Balancer from 'react-wrap-balancer'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'

const BuySeats: React.FC<{
  productId: string
  userId: string
  productName: string
}> = ({productId, productName, userId}) => {
  return (
    <div
      id="buy-more-seats-modal"
      className="flex max-w-xs flex-col items-center text-center"
    >
      <Balancer>
        <p className="mb-3 mt-6 text-xl">
          Get your team to level up with <b>{productName}</b>
        </p>
      </Balancer>
      <Dialog.Root>
        <Dialog.Trigger
          data-pricing-buy-more-seats={productName}
          className="px-5 py-4 text-xl leading-snug bg-gradient-to-b from-[#ffc26a] to-[#ffa82e] text-white border-none rounded-md w-full font-tt-demibold"
        >
          <span className="block duration-200">Buy more seats</span>
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-8 shadow-2xl shadow-gray-500/10">
          <Dialog.Title className="pb-5 text-center font-heading text-2xl font-black leading-tight">
            <Balancer>Buy more seats for {productName}</Balancer>
          </Dialog.Title>
          <BuyMoreSeats productId={productId} userId={userId} />
          <Dialog.Close className="absolute right-2 top-2 rounded-full p-2 hover:bg-gray-100">
            <XIcon className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export default BuySeats

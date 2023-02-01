import {trpc} from '../trpc/trpc.client'
import {useForm} from 'react-hook-form'
import {PurchaseUserTransfer} from '@skillrecordings/database'
import * as React from 'react'

type PurchaseTransferFormData = {
  email: string
}

const PurchaseTransferForm = ({
  purchaseUserTransferId,
  refetch,
}: {
  purchaseUserTransferId: string
  refetch: () => Promise<void>
}) => {
  const utils = trpc.useContext()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm<PurchaseTransferFormData>()
  const {data: purchaseUserTransfer, status} =
    trpc.purchaseUserTransfer.byId.useQuery({
      id: purchaseUserTransferId,
    })

  console.log({purchaseUserTransfer, status})

  const {mutate, error, isLoading} =
    trpc.purchaseUserTransfer.initiate.useMutation({
      onSuccess: async (input) => {
        utils.invalidate()
        reset()
        refetch()
      },
    })
  const onSubmit = (data: PurchaseTransferFormData) => {
    mutate({
      purchaseUserTransferId: purchaseUserTransferId,
      email: data.email,
    })
  }

  return (
    <div>
      <form
        className="flex w-full flex-col gap-2 text-left md:flex-row"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="sr-only" htmlFor="email">
          Email:
        </label>
        <input
          className="w-full rounded-md border border-gray-800 bg-gray-800/50 px-3 py-2 text-lg"
          type="email"
          {...register('email', {required: true})}
          placeholder="somebody@example.com"
        />
        {errors.email && <span>This field is required</span>}
        <button
          className="relative flex flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-cyan-600 to-cyan-500 py-2 px-5 text-lg font-semibold shadow-2xl shadow-cyan-900/50 transition focus-visible:ring-white hover:brightness-110"
          type="submit"
          disabled={isLoading}
        >
          Transfer
        </button>
        {error && <span>{error.message}</span>}
      </form>
    </div>
  )
}

export const Transfer = ({
  purchaseUserTransfers,
  refetch,
}: {
  purchaseUserTransfers: PurchaseUserTransfer[]
  refetch: () => Promise<any>
}) => {
  const cancelMutation = trpc.purchaseUserTransfer.cancel.useMutation({
    onSuccess: async (input) => {
      refetch()
    },
  })
  return (
    <div className="mt-12 flex flex-col gap-3">
      {purchaseUserTransfers.map((purchaseUserTransfer) => {
        // jsx form component that provides an input and submit button to initiate a transfer
        return (
          <>
            {purchaseUserTransfer.transferState === 'AVAILABLE' && (
              <>
                <h2 className="text-2xl font-bold">
                  Transfer this purchase to another email address.
                </h2>
                <p className="text-gray-200">
                  You can transfer your purchase to another user. This will
                  allow them to access the content you purchased. Once the
                  transfer is complete you will no longer have access to the
                  content or associated invoices.
                </p>
                <PurchaseTransferForm
                  purchaseUserTransferId={purchaseUserTransfer.id}
                  key={purchaseUserTransfer.id}
                  refetch={refetch}
                />
              </>
            )}
            {purchaseUserTransfer.transferState === 'INITIATED' && (
              <div>
                <h2 className="mb-3 text-2xl font-bold">
                  This purchase is being transferred. Once they accept you will
                  no longer have access to this purchase or its associated
                  invoice. You can cancel the transfer at any time before it is
                  accepted or expires.
                </h2>
                <button
                  className="relative flex flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-tr from-cyan-600 to-cyan-500 py-2 px-5 text-lg font-semibold shadow-2xl shadow-cyan-900/50 transition focus-visible:ring-white hover:brightness-110"
                  onClick={() => {
                    cancelMutation.mutate({
                      purchaseUserTransferId: purchaseUserTransfer.id,
                    })
                  }}
                >
                  Cancel Transfer
                </button>
              </div>
            )}
            {purchaseUserTransfer.transferState === 'COMPLETED' && (
              <div>
                <p className="text-gray-200">
                  This purchase has been transferred. You no longer have access
                  to this purchase or its associated invoice.
                </p>
              </div>
            )}
          </>
        )
      })}
    </div>
  )
}

import {trpc} from '../trpc/trpc.client'
import {useForm} from 'react-hook-form'
import {PurchaseUserTransfer} from '@skillrecordings/database'
import * as React from 'react'
import {Button, Input, Label} from '@skillrecordings/ui'

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
    <form
      id="purchase-transfer-form"
      className="flex w-full flex-col gap-2 text-left md:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label className="sr-only" htmlFor="email">
        Email:
      </Label>
      <Input
        type="email"
        {...register('email', {required: true})}
        placeholder="somebody@example.com"
      />
      {errors.email && <span>This field is required</span>}
      <Button variant="outline" type="submit" disabled={isLoading}>
        Transfer
      </Button>
      {error && <span>{error.message}</span>}
    </form>
  )
}

export const Transfer = ({
  purchaseUserTransfers,
  className = '',
  refetch,
}: {
  purchaseUserTransfers: PurchaseUserTransfer[]
  refetch: () => Promise<any>
  className?: string
}) => {
  const cancelMutation = trpc.purchaseUserTransfer.cancel.useMutation({
    onSuccess: async (input) => {
      refetch()
    },
  })

  return (
    <div id="purchase-transfer" className={className}>
      {purchaseUserTransfers.map((purchaseUserTransfer) => {
        const STATE = purchaseUserTransfer.transferState

        return (
          <div
            key={purchaseUserTransfer.id}
            data-transfer-state={STATE}
            className="flex flex-col gap-3"
          >
            {STATE === 'AVAILABLE' && (
              <>
                <h2 className="text-2xl font-bold">
                  Transfer this purchase to another email address
                </h2>
                <p>
                  You can transfer your purchase to another email address. We
                  recommend using a personal/permanent email address. Once the
                  transfer is complete you will no longer have access to the
                  content or associated invoices from this account for this
                  purchase.
                </p>
                <p>
                  ⚠️ Only a single email transfer is provided per purchase as a
                  courtesy!
                </p>
                <PurchaseTransferForm
                  purchaseUserTransferId={purchaseUserTransfer.id}
                  key={purchaseUserTransfer.id}
                  refetch={refetch}
                />
              </>
            )}
            {STATE === 'INITIATED' && (
              <>
                <h2 className="mb-3 text-2xl font-bold">
                  This purchase is being transferred. Once accepted you will no
                  longer have access to this purchase or its associated invoice.
                  You can cancel the transfer at any time before it is accepted
                  or expires.
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => {
                    cancelMutation.mutate({
                      purchaseUserTransferId: purchaseUserTransfer.id,
                    })
                  }}
                >
                  Cancel Transfer
                </Button>
              </>
            )}
            {STATE === 'COMPLETED' && (
              <>
                <p>
                  This purchase has been transferred. You no longer have access
                  to this purchase or its associated invoice.
                </p>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

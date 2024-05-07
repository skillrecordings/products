import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon, CheckIcon} from '@heroicons/react/solid'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'

type DialogProps = {
  handleCloseDialog: () => void
  isOpen: boolean
  title: string
  isFormSubmitted: boolean
}

const DialogComp: React.FC<React.PropsWithChildren<DialogProps>> = ({
  handleCloseDialog,
  children,
  isOpen,
  title,
  isFormSubmitted,
}) => {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal
        container={
          isBrowser()
            ? (window.document.getElementById('layout') as HTMLElement)
            : undefined
        }
      >
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(14,24,42,0.5)] backdrop-blur-[2px]" />
        <Dialog.Content
          onPointerDownOutside={handleCloseDialog}
          onEscapeKeyDown={handleCloseDialog}
          className="fixed left-5 right-5 top-1/2 z-50 mx-auto max-h-[85vh] w-auto max-w-[680px] -translate-y-1/2 rounded-lg border border-indigo-500 bg-background p-8 shadow-2xl shadow-black/50"
        >
          <CloseButton
            ref={closeButtonRef}
            handleCloseDialog={handleCloseDialog}
          />
          {isFormSubmitted ? (
            <ConfirmationMessage />
          ) : (
            <>
              <Dialog.Title className="mb-6 mt-4 text-center text-xl font-semibold md:text-2xl">
                {title}
              </Dialog.Title>
              {children}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type CloseButtonProps = {
  handleCloseDialog: () => void
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({handleCloseDialog}, ref) => {
    return (
      <div className="absolute right-2 top-2">
        <button
          ref={ref}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-sm font-medium text-er-gray-600 transition hover:bg-er-gray-200 hover:shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          onClick={handleCloseDialog}
        >
          <XIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Close feedback dialog</span>
        </button>
      </div>
    )
  },
)

export const ConfirmationMessage = ({
  message = `Feedback sent, thank you!`,
}: {
  message?: string
}) => {
  return (
    <div
      aria-live="polite"
      className="mt-3 flex flex-wrap items-center justify-center space-x-2 text-center text-xl font-semibold text-text"
    >
      <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />{' '}
      <span>{message}</span>
    </div>
  )
}

export default DialogComp

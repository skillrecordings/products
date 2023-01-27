import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'

type DialogProps = {
  handleCloseDialog: () => void
  isOpen: boolean
  title: string
}

const DialogComp: React.FC<React.PropsWithChildren<DialogProps>> = ({
  handleCloseDialog,
  children,
  isOpen,
  title,
}) => {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay data-sr-feedback-widget-overlay="" />
        <Dialog.Content
          data-sr-feedback-widget-content=""
          onEscapeKeyDown={handleCloseDialog}
          // onPointerDownOutside={handleCloseDialog}
        >
          <CloseButton
            ref={closeButtonRef}
            handleCloseDialog={handleCloseDialog}
          />
          <Dialog.Title data-sr-feedback-widget-title="">{title}</Dialog.Title>
          {children}
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
      <div data-sr-feedback-widget-close="">
        <button ref={ref} type="button" onClick={handleCloseDialog}>
          <XIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Close feedback dialog</span>
        </button>
      </div>
    )
  },
)

export default DialogComp

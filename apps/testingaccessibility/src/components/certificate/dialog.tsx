import React from 'react'
import Dialog from 'components/dialog'
import CertificateForm from './form'
import {SanityDocument} from '@sanity/client'

type CertificateDialogProps = {
  handleCloseDialog: () => void
  module: SanityDocument
  isOpen: boolean
}

const CertificateDialog: React.FC<
  React.PropsWithChildren<CertificateDialogProps>
> = ({handleCloseDialog, module, isOpen, children}) => {
  return (
    <Dialog
      title="Get your certificate"
      isOpen={isOpen}
      handleCloseDialog={handleCloseDialog}
    >
      {children}
      <CertificateForm module={module} />
    </Dialog>
  )
}

export default CertificateDialog

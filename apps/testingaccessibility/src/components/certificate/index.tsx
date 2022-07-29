import React from 'react'
import {BadgeCheckIcon, LockClosedIcon} from '@heroicons/react/solid'
import {SanityDocument} from '@sanity/client'
import CertificateDialog from 'components/certificate/dialog'
import cx from 'classnames'

type CertificateProps = {
  isAvailable: boolean
  module: SanityDocument
}

const GetCertificate: React.FC<React.PropsWithChildren<CertificateProps>> = ({
  isAvailable = false,
  module,
}) => {
  const Component = isAvailable ? 'button' : 'span'
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] =
    React.useState<boolean>(false)

  return (
    <Component
      onClick={() => isAvailable && setIsCertificateDialogOpen(true)}
      className={cx(
        `w-full  pl-3 gap-2 flex rounded-md items-center font-normal py-4 text-sand-100 transition focus-visible:ring-white`,
        {
          'group-hover:bg-green-800/20': isAvailable,
        },
      )}
    >
      <span
        className={cx(
          'w-5 h-5 rounded-full flex items-center justify-center relative z-10 ',
          {
            'border border-white/20 bg-green-700 bg-noise': !isAvailable,
            'text-green-500 bg-white': isAvailable,
          },
        )}
      >
        {isAvailable ? (
          <BadgeCheckIcon className="w-6 h-6" />
        ) : (
          <LockClosedIcon className="w-3 h-3" />
        )}
      </span>
      Certificate
      {isAvailable && (
        <CertificateDialog
          key={`certificate-${module.title}`}
          module={module}
          isOpen={isCertificateDialogOpen}
          handleCloseDialog={() => setIsCertificateDialogOpen(false)}
        />
      )}
    </Component>
  )
}

export default GetCertificate

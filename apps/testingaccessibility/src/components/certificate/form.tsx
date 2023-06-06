import React from 'react'
import {useSession} from 'next-auth/react'
import {DownloadIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'

const CertificateForm: React.FC<
  React.PropsWithChildren<{module?: SanityDocument}>
> = ({module}) => {
  const {data: session} = useSession()
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const defaultName = session?.user?.name || ''
  const [name, setName] = React.useState(defaultName)
  const POST_URL = module?.slug
    ? `/api/certificate?module=${module.slug}&name=${name}`
    : `/api/certificate&name=${name}`

  return (
    <form className="flex items-end gap-3">
      <div className="flex flex-col w-full">
        <label htmlFor="name" className="pb-1">
          Name on the certificate
        </label>
        <input
          className="px-3 py-2 rounsession?.user?.name || ''ded-md bg-gray-100"
          defaultValue={defaultName}
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          ref={nameInputRef}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <a
        role="button"
        download
        href={POST_URL}
        className="flex-shrink-0 mt-4 text-white focus-visible:ring-offset-1 hover:bg-green-500 transition bg-green-600 rounded-md flex items-center px-3 py-2 font-medium gap-1"
      >
        <DownloadIcon aria-hidden="true" className="w-5 h-5" />
        Get Certificate
      </a>
    </form>
  )
}

export default CertificateForm

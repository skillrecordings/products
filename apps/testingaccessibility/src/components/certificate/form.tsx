import React from 'react'
import {useSession} from 'next-auth/react'
import {DownloadIcon} from '@heroicons/react/outline'
import {SanityDocument} from '@sanity/client'

const CertificateForm: React.FC<{module?: SanityDocument}> = ({module}) => {
  const {data: session} = useSession()
  const POST_URL = module
    ? `/api/certificate/modules/${module.slug}`
    : '/api/certificate'
  const nameInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <form action={POST_URL} className="flex items-end gap-3">
      <div className="flex flex-col w-full">
        <label htmlFor="name" className="pb-1">
          Name on the certificate
        </label>
        <input
          className="px-3 py-2 rounded-md bg-gray-100"
          defaultValue={session?.user?.name || ''}
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          ref={nameInputRef}
        />
      </div>
      <button className="flex-shrink-0 mt-4 text-white focus-visible:ring-offset-1 hover:bg-green-500 transition bg-green-600 rounded-md flex items-center px-3 py-2 font-medium gap-1">
        <DownloadIcon aria-hidden="true" className="w-5 h-5" />
        Get Certificate
      </button>
    </form>
  )
}

export default CertificateForm

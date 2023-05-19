import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {DownloadIcon, XIcon} from '@heroicons/react/solid'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'

const CertificateForm: React.FC<React.PropsWithChildren> = () => {
  const {data: session} = useSession()
  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: session?.user?.name,
      certificateUrl: `/api/certificate?name=${session?.user?.name}`,
    },
  })
  const {register, watch} = form
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return form.setValue(
      'certificateUrl',
      `/api/certificate?name=${e.currentTarget.value || session?.user?.name}`,
    )
  }
  React.useEffect(() => {
    if (session?.user?.name) {
      form.setValue('name', session?.user?.name)
      form.setValue(
        'certificateUrl',
        `/api/certificate?name=${session?.user?.name}`,
      )
    }
  }, [session])
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 focus:outline-none">
        <Dialog.Title className="border-b border-gray-200 pb-3 text-xl">
          Fill out your details
        </Dialog.Title>
        <fieldset className="flex flex-col items-start mt-3">
          <label
            htmlFor="name"
            className="inline-block mb-1 text-lg opacity-70"
          >
            Name on the certificate
          </label>
          <input
            {...register('name', {
              required: true,
              onChange: handleNameChange,
            })}
            type="text"
            placeholder="Your name"
            id="name"
            className="w-full rounded bg-gray-100 px-3 py-2 text-lg font-medium"
          />
          <a
            download
            href={watch().certificateUrl}
            className="mt-5 inline-flex cursor-pointer gap-1 self-end rounded bg-tjs-green py-2 px-3 font-tt-demibold text-white transition hover:brightness-110 text-lg"
            onClick={() => {
              track('downloaded workshop certificate')
            }}
          >
            Download <DownloadIcon className="w-4" />
          </a>
        </fieldset>
        <Dialog.Close asChild>
          <button
            className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <XIcon aria-hidden="true" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default CertificateForm

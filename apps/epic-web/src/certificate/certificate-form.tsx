import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {DownloadIcon, XIcon} from '@heroicons/react/solid'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'

const CertificateForm: React.FC<
  React.PropsWithChildren<{workshop: Module}>
> = ({workshop}) => {
  const {data: session} = useSession()

  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: session?.user?.name || '',
      certificateUrl: `/api/certificate?module=${workshop.slug.current}&name=${session?.user?.name}`,
    },
  })
  const {register, watch} = form
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return form.setValue(
      'certificateUrl',
      `/api/certificate?module=${workshop.slug.current}&name=${
        e.currentTarget.value || session?.user?.name
      }`,
    )
  }
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-gray-700/50 bg-gray-800 p-[25px] shadow-2xl shadow-black/40 focus:outline-none">
        <Dialog.Title className="border-b border-gray-700 pb-3 text-xl font-semibold">
          Fill out your details
        </Dialog.Title>
        <fieldset className="flex flex-col items-start pt-3">
          <label
            htmlFor="name"
            className="inline-block pb-1 text-lg text-gray-300"
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
            className="w-full rounded bg-gray-700 px-3 py-2 text-lg font-medium"
          />
          {/* Using anchor instead of a button to trigger native download action */}
          <a
            download
            href={watch().certificateUrl}
            className="mt-5 inline-flex cursor-pointer gap-1 self-end rounded bg-cyan-300 py-2 px-3 font-semibold text-black transition hover:brightness-110"
            onClick={() => {
              track('downloaded workshop certificate', {
                module: workshop.slug.current,
              })
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

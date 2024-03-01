import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {DownloadIcon, XIcon} from '@heroicons/react/solid'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {trpc} from '@/trpc/trpc.client'
import {Button, Input} from '@skillrecordings/ui'
import toast from 'react-hot-toast'
import Spinner from '@/components/spinner'
import {ClipboardCopyIcon} from '@heroicons/react/outline'
import {cn} from '@skillrecordings/ui/utils/cn'

const CertificateForm: React.FC<React.PropsWithChildren<{module: Module}>> = ({
  module,
}) => {
  const {data: session} = useSession()

  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: session?.user?.name || '',
      certificateUrl: `/api/certificate?module=${module.slug.current}&name=${session?.user?.name}`,
    },
  })
  const {register, watch} = form
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return form.setValue(
      'certificateUrl',
      `/api/certificate?module=${module.slug.current}&name=${
        e.currentTarget.value || session?.user?.name
      }`,
    )
  }

  const uploadCertificate = trpc.certificate.upload.useMutation()
  const imagePath = 'https://totaltypescript.com' + watch().certificateUrl
  const [certUrl, setCertUrl] = React.useState()

  const {data: cert, status} = trpc.certificate.get.useQuery(
    {
      moduleSlug: module.slug.current as string,
      imagePath,
    },
    {
      onSuccess: (data) => {
        setCertUrl(data.secure_url)
      },
    },
  )

  const copyCertUrlRef = React.useRef<HTMLButtonElement>(null)
  const urlInputRef = React.useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const handleGenerateCertUrl = async () => {
    setIsLoading(true)
    await uploadCertificate.mutateAsync(
      {
        imagePath,
        moduleSlug: module.slug.current as string,
      },
      {
        onSuccess: (data) => {
          setCertUrl(data.secure_url)
          setIsLoading(false)
          toast.success('Certificate URL generated')
          urlInputRef?.current?.select()
        },
        onError: (error) => {
          console.log(error)
          toast.error('Error: ' + error.message)
        },
      },
    )

    track('clicked use certificate url', {
      module: module.slug.current,
    })
  }

  return (
    <Dialog.Portal container={window.document.getElementById('layout')}>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-gray-700/50 bg-gray-800 p-[25px] shadow-2xl shadow-black/40 focus:outline-none">
        <Dialog.Title className="border-b border-gray-700 pb-3 text-xl font-semibold">
          Your Certificate of Completion
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
          <div className="mt-5 flex w-full flex-col items-center justify-start gap-5 border-t border-gray-700 pt-5">
            <a
              download
              href={watch().certificateUrl}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1 self-end rounded bg-cyan-300 px-3 py-2 font-semibold text-black transition hover:brightness-110"
              onClick={() => {
                track('downloaded workshop certificate', {
                  module: module.slug.current,
                })
              }}
            >
              Download <DownloadIcon className="w-4" />
            </a>
            <div className="flex w-full flex-col">
              <h3 className="inline-block pb-1 text-lg text-gray-300">
                Share URL (can be used on LinkedIn, etc.)
              </h3>
              <div className="flex w-full items-center">
                <div className="relative flex w-full items-center">
                  <Button
                    type="button"
                    variant={certUrl ? 'outline' : 'ghost'}
                    disabled={isLoading}
                    ref={copyCertUrlRef}
                    className={cn(
                      ' flex-shrink-0 border-gray-600 px-2 font-semibold',
                      {
                        'min-w-[110px] rounded-r-none': certUrl,
                        'w-full bg-gray-600': !certUrl,
                      },
                    )}
                    onClick={handleGenerateCertUrl}
                  >
                    {isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : certUrl ? (
                      'Generate'
                    ) : (
                      'Generate link to certificate'
                    )}
                  </Button>
                  {certUrl ? (
                    <Input
                      ref={urlInputRef}
                      readOnly
                      className="rounded-l-none border-gray-600 border-l-transparent"
                      onClick={() => {
                        if (certUrl) {
                          track('copied certificate url')
                          urlInputRef?.current?.select()
                        } else {
                        }
                      }}
                      value={certUrl || ''}
                    />
                  ) : null}
                  {certUrl ? (
                    <button
                      className="absolute right-1 bg-gray-800 p-1"
                      onClick={() => {
                        navigator.clipboard.writeText(certUrl)
                        toast.success('Copied to clipboard')
                      }}
                    >
                      <ClipboardCopyIcon className="h-6 w-5" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <Dialog.Close asChild>
          <button
            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {DownloadIcon, XIcon} from '@heroicons/react/solid'
import {useSession} from 'next-auth/react'
import {useForm} from 'react-hook-form'
import {trpc} from '@/trpc/trpc.client'
import {Button, Input, Label} from '@skillrecordings/ui'
import toast from 'react-hot-toast'
import Spinner from '@/components/spinner'
import {ClipboardCopyIcon} from '@heroicons/react/outline'
import {cn} from '@skillrecordings/ui/utils/cn'
import Image from 'next/image'
import type {Workshop} from '@/lib/workshops'
import type {Tutorial} from '@/lib/tutorials'
import {
  COURSE_CERTIFICATE_COPY,
  COURSE_CERTIFICATE_SLUG,
  EPIC_REACT_COURSE_PRODUCT_ID,
  EPIC_REACT_CERTIFICATE_MARK,
} from './course-certificate'

const CertificateForm: React.FC<
  | {course: true; module?: never}
  | {course?: never; module: Workshop | Tutorial | Module}
> = ({course, module}) => {
  const moduleSlug = module?.slug.current ?? COURSE_CERTIFICATE_SLUG
  const {data: session, update: updateSession} = useSession()
  const {data: userData, status: userStatus} = trpc.user.currentUser.useQuery()

  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: session?.user?.name || '',
    },
  })
  const [updatedName, setUpdatedName] = React.useState<string>()
  const savedName =
    updatedName ?? (userData ? userData.name : session?.user?.name) ?? ''
  const userNameMutation = trpc.user.updateName.useMutation({
    onSuccess: (data) => {
      const name = data.name ?? ''
      setUpdatedName(name)
      form.reset({name})
    },
  })
  const {register, watch} = form

  const handleSubmit = async () => {
    return await userNameMutation
      .mutateAsync({
        name: watch().name.trim(),
      })
      .then(async (data) => {
        toast.success('Name updated')
        await updateSession(() => {
          return {
            name: data.name,
          }
        })
      })
      .catch((error) => {
        toast.error('Error updating name')
        console.debug(error)
      })
  }

  const certificateParams = module
    ? new URLSearchParams({moduleId: module._id, name: savedName})
    : new URLSearchParams({productId: EPIC_REACT_COURSE_PRODUCT_ID})
  const certificateUrl = `/api/certificate?${certificateParams}`
  const {isDirty, isSubmitting} = form.formState
  const canGenerate =
    !!savedName.trim() && (!course || (!!userData?.id && !isDirty))

  React.useEffect(() => {
    if (!isDirty) form.reset({name: savedName})
  }, [form, isDirty, savedName])

  const urlInputRef = React.useRef<HTMLInputElement>(null)

  const uploadCertificate = trpc.certificate.upload.useMutation()
  const {data: clCert, status: clCertStatus} = trpc.certificate.get.useQuery(
    {moduleSlug},
    {enabled: userStatus === 'success' && !!userData?.id},
  )
  const copyCertUrlRef = React.useRef<HTMLButtonElement>(null)
  const [certUrl, setCertUrl] = React.useState(clCert?.secure_url)
  React.useEffect(() => {
    if (clCertStatus === 'success' && clCert?.secure_url) {
      setCertUrl(clCert.secure_url)
    }
  }, [clCert, clCertStatus])
  const isLoading = uploadCertificate.isLoading
  const handleGenerateCertUrl = () => {
    uploadCertificate.mutate(
      module
        ? {moduleSlug, imagePath: 'https://epicreact.dev' + certificateUrl}
        : {moduleSlug},
      {
        onSuccess: (data) => {
          if (!data?.secure_url) {
            toast.error('Could not generate certificate URL')
            return
          }
          setCertUrl(data.secure_url)
          toast.success('Certificate URL generated')
          urlInputRef.current?.select()
        },
        onError: () => toast.error('Could not generate certificate URL'),
      },
    )

    track('clicked use certificate url', {module: moduleSlug})
  }
  return (
    <Dialog.Portal container={window.document.getElementById('layout')}>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] border border-gray-100 bg-white p-[25px] shadow-2xl shadow-black/20 focus:outline-none dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-black/40">
        <Dialog.Title className=" pb-3 text-xl font-semibold dark:border-gray-700">
          Your Certificate of Completion
        </Dialog.Title>
        <div className="pointer-events-none relative flex items-center justify-center">
          <Image
            src="/assets/epic-react-certificate-bg.svg"
            width={1263}
            height={893}
            alt=""
            className="w-full rounded-lg shadow-xl"
          />
          {(course || module?.image) && (
            <Image
              className="absolute top-8"
              src={course ? EPIC_REACT_CERTIFICATE_MARK : module?.image || ''}
              alt=""
              width={75}
              height={75}
            />
          )}
          <div className="absolute flex flex-col items-center text-center">
            <div className="mt-16">
              <div className="text-xl font-bold text-gray-900">
                {form.watch('name')}
              </div>
              <div className="pt-1 text-[0.5rem] text-gray-900">
                {module
                  ? `Has successfully completed the ${module.title} ${module.moduleType}.`
                  : COURSE_CERTIFICATE_COPY}
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 text-[0.4rem] opacity-75">
            {new Date().toLocaleDateString('en-US', {timeZone: 'UTC'})}
          </div>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <fieldset className="flex flex-col items-start pt-3">
            <Label
              htmlFor="name"
              className="inline-block pb-1 text-lg text-gray-700 dark:text-gray-300"
            >
              Name on the certificate
            </Label>
            <div className="flex w-full items-center gap-2">
              <Input
                {...register('name', {
                  required: true,
                  validate: (name) => !!name.trim() || 'Please enter your name',
                })}
                type="text"
                placeholder="Your name"
                id="name"
                className="flex w-full flex-grow rounded border-none bg-gray-100 px-3 py-2 text-lg font-medium shadow-inner dark:bg-gray-700"
                disabled={isSubmitting}
              />
              <Button
                variant="outline"
                className="inline-flex items-center justify-center rounded border border-primary bg-primary px-3 py-2 text-base font-semibold text-white hover:bg-primary/80 hover:text-white disabled:text-white dark:disabled:text-gray-800"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner className="absolute h-5 w-5 text-foreground" />
                ) : null}
                Save
              </Button>
            </div>
            {/* Using anchor instead of a button to trigger native download action */}
            <div className="mt-5 flex w-full flex-col items-center justify-start gap-5 dark:border-gray-700">
              <Button
                disabled={isSubmitting || !canGenerate}
                size="lg"
                asChild
                className={cn(
                  'inline-flex w-full cursor-pointer items-center justify-center gap-1 self-end rounded bg-primary px-3 py-3 font-semibold text-primary-foreground transition hover:brightness-110',
                  {
                    'cursor-wait opacity-50': isSubmitting,
                  },
                )}
              >
                <a
                  download={`${moduleSlug}-certificate.png`}
                  href={
                    canGenerate && !isSubmitting ? certificateUrl : undefined
                  }
                  aria-disabled={!canGenerate || isSubmitting}
                  onClick={() => {
                    if (canGenerate && !isSubmitting) {
                      track(
                        course
                          ? 'downloaded course certificate'
                          : 'downloaded workshop certificate',
                        {module: moduleSlug},
                      )
                    }
                  }}
                  className="text-white hover:bg-primary/80 sm:text-base"
                >
                  <DownloadIcon className="w-4" />
                  Get Your Certificate
                </a>
              </Button>
              <div className="flex w-full flex-col border-t border-gray-100 pt-5 dark:border-gray-700">
                <h3 className="inline-block pb-1 text-lg text-gray-700 dark:text-gray-300">
                  Share URL (can be used on LinkedIn, etc.)
                </h3>
                <div className="flex w-full items-center">
                  <div className="relative flex w-full items-center">
                    {!certUrl && (
                      <Button
                        type="button"
                        variant={certUrl ? 'outline' : 'ghost'}
                        disabled={isLoading || isSubmitting || !canGenerate}
                        ref={copyCertUrlRef}
                        className={cn(
                          ' flex-shrink-0 border-gray-600 px-2 font-semibold',
                          {
                            'min-w-[110px] rounded-r-none': certUrl,
                            'w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600':
                              !certUrl,
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
                    )}
                    {certUrl ? (
                      <Input
                        ref={urlInputRef}
                        readOnly
                        className={cn('border-border', {
                          'rounded-l-none border-l-transparent': !certUrl,
                        })}
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
                        type="button"
                        className="absolute right-1 rounded bg-gray-200 p-1 dark:bg-gray-800"
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
        </form>
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

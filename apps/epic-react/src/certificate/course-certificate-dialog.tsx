import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import toast from 'react-hot-toast'
import {Button, Input, Label} from '@skillrecordings/ui'
import {trpc} from '@/trpc/trpc.client'
import {
  COURSE_CERTIFICATE_PATH,
  COURSE_CERTIFICATE_SLUG,
} from './course-certificate'

export default function CourseCertificate() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="mb-8 flex sm:mb-16">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="rounded-lg border-2 border-emerald-600 px-4 py-3 text-base font-semibold text-text hover:bg-indigo-300/25">
          Course Certificate
        </Dialog.Trigger>
        {open && <CourseCertificateForm />}
      </Dialog.Root>
    </div>
  )
}

function CourseCertificateForm() {
  const {data: user} = trpc.user.currentUser.useQuery()
  const utils = trpc.useContext()
  const [draft, setDraft] = React.useState<string>()
  const [preview, setPreview] = React.useState<{name: string; url: string}>()
  const [previewError, setPreviewError] = React.useState(false)
  const [shareUrl, setShareUrl] = React.useState<string>()
  const {data: certificate} = trpc.certificate.get.useQuery({
    moduleSlug: COURSE_CERTIFICATE_SLUG,
  })
  const savedName = user?.name ?? ''
  const name = draft ?? savedName
  const saveName = trpc.user.updateName.useMutation({
    onSuccess: (updated) => {
      utils.user.currentUser.setData(undefined, (current) =>
        current ? {...current, name: updated.name} : current,
      )
      setDraft(undefined)
    },
    onError: () => toast.error('Could not save your name'),
  })
  const upload = trpc.certificate.upload.useMutation({
    onSuccess: (result) => {
      if (result?.secure_url) setShareUrl(result.secure_url)
      else toast.error('Could not generate a share link')
    },
    onError: () => toast.error('Could not generate a share link'),
  })

  React.useEffect(() => {
    if (!savedName.trim()) return
    const controller = new AbortController()
    let url: string | undefined
    setPreview(undefined)
    setPreviewError(false)

    async function loadPreview() {
      const response = await fetch(COURSE_CERTIFICATE_PATH, {
        signal: controller.signal,
      })
      if (
        !response.ok ||
        response.headers.get('content-type') !== 'image/png'
      ) {
        throw new Error('Could not load course certificate')
      }
      const blob = await response.blob()
      if (controller.signal.aborted) return
      url = URL.createObjectURL(blob)
      setPreview({name: savedName, url})
    }

    void loadPreview().catch(() => {
      if (!controller.signal.aborted) setPreviewError(true)
    })
    return () => {
      controller.abort()
      if (url) URL.revokeObjectURL(url)
    }
  }, [savedName])

  const previewUrl = preview?.name === savedName ? preview.url : undefined
  const currentShareUrl = shareUrl ?? certificate?.secure_url
  const canIssue = previewUrl && name === savedName && !saveName.isLoading

  return (
    <Dialog.Portal container={document.getElementById('layout')}>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto rounded-lg border border-border bg-background p-6 shadow-xl">
        <Dialog.Title className="text-xl font-semibold">
          Your Course Certificate
        </Dialog.Title>
        <Dialog.Description className="text-sm">
          Save the name you want on your certificate.
        </Dialog.Description>
        {/* The preview and download use the same issued PNG, not the draft text. */}
        {previewUrl && (
          <img
            className="w-full rounded border border-border"
            src={previewUrl}
            alt={`Course Certificate for ${savedName}`}
          />
        )}
        {previewError && (
          <p role="status">
            Could not load your certificate. Close and reopen to retry.
          </p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (name.trim()) saveName.mutate({name: name.trim()})
          }}
        >
          <Label htmlFor="course-certificate-name">
            Name on the certificate
          </Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="course-certificate-name"
              required
              value={name}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!user || saveName.isLoading}
            />
            <Button
              type="submit"
              disabled={
                !user ||
                name === savedName ||
                !name.trim() ||
                saveName.isLoading
              }
            >
              Save
            </Button>
          </div>
        </form>
        {canIssue && (
          <Button asChild>
            <a href={previewUrl} download="epic-react-pro-certificate.png">
              Download Certificate
            </a>
          </Button>
        )}
        {currentShareUrl ? (
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(currentShareUrl).then(
                () => toast.success('Share link copied'),
                () => toast.error('Could not copy the share link'),
              )
            }}
          >
            Copy Share Link
          </Button>
        ) : (
          <Button
            variant="outline"
            type="button"
            disabled={!canIssue || upload.isLoading}
            onClick={() => upload.mutate({moduleSlug: COURSE_CERTIFICATE_SLUG})}
          >
            {upload.isLoading ? 'Generating link…' : 'Generate Share Link'}
          </Button>
        )}
        <Dialog.Close asChild>
          <Button type="button" variant="ghost">
            Close
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

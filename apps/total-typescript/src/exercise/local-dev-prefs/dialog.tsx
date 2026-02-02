import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@skillrecordings/ui'
import LocalDevPrefsForm from './form'
import {Clipboard} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SetLocalDevPrefsDialog({
  children,
  resourceId,
  resourceTitle,
  githubRepositoryUrl,
  githubRepositoryName,
  isDialogOpen = false,
  onOpenChange,
}: {
  children?: React.ReactNode
  resourceId: string
  resourceTitle: string
  githubRepositoryUrl: string
  githubRepositoryName: string
  isDialogOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const gitCloneCommand = `git clone ${githubRepositoryUrl}.git`
  return (
    <Dialog
      defaultOpen={!onOpenChange ? isDialogOpen : undefined}
      open={onOpenChange ? isDialogOpen : undefined}
      onOpenChange={onOpenChange}
    >
      {children || <DialogTrigger>Open</DialogTrigger>}
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl leading-tight">
            Configure Local Development Preferences for {resourceTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This will be used to open exercises in your preferred IDE.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 border-t pt-5">
          <div className="mb-6 flex flex-col items-baseline gap-3 text-left sm:flex-row">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-sm font-semibold shadow-xl">
              1
            </div>
            <div className="w-full">
              <Label>
                Clone following{' '}
                <a
                  className="underline"
                  href={githubRepositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub repository
                </a>{' '}
                to your computer:
              </Label>
              <div className="relative mt-2 flex items-center">
                <Input
                  className="border-white/20 pr-10"
                  readOnly
                  value={gitCloneCommand}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 scale-75"
                  onClick={() => {
                    navigator.clipboard.writeText(gitCloneCommand)
                    toast.success('Copied to clipboard')
                  }}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 text-sm">
                And follow instructions in the{' '}
                <a
                  className="underline"
                  href={`${githubRepositoryUrl}#readme`}
                  target="_blank"
                  rel="noreferrer"
                >
                  README
                </a>{' '}
                to set up the project.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-baseline gap-3 text-left sm:flex-row">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-sm font-semibold shadow-xl">
              2
            </div>
            <LocalDevPrefsForm
              githubRepositoryName={githubRepositoryName}
              resourceId={resourceId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui'
import LocalDevPrefsForm from './form'

export default function SetLocalDevPrefsDialog({
  children,
  resourceId,
  resourceTitle,
  githubRepositoryUrl,
  githubRepositoryName,
  isDialogOpen = false,
}: {
  children?: React.ReactNode
  resourceId: string
  resourceTitle: string
  githubRepositoryUrl: string
  githubRepositoryName: string
  isDialogOpen?: boolean
}) {
  return (
    <Dialog defaultOpen={isDialogOpen}>
      {children || <DialogTrigger>Open</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl leading-tight">
            Configure Local Development Preferences for {resourceTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This will be used to open exercises in your preferred IDE.
          </DialogDescription>
        </DialogHeader>
        <div>
          <LocalDevPrefsForm
            githubRepositoryName={githubRepositoryName}
            resourceId={resourceId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

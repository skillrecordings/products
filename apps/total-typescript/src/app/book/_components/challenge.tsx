'use client'

import * as React from 'react'
import {useCookies} from 'react-cookie'
import {getStartCommand} from '@/exercise/stackblitz-iframe'
import {Input} from '@skillrecordings/ui/primitives/input'
import {Label} from '@skillrecordings/ui/primitives/label'
import {Button} from '@skillrecordings/ui/primitives/button'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui/primitives/dialog'
import {CogIcon, InformationCircleIcon} from '@heroicons/react/outline'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {usePathname} from 'next/navigation'

export const Challenge: React.FC<{repo?: string | null; file?: string}> = ({
  repo,
  file,
}) => {
  const startCommand = getStartCommand({_type: 'exercise'}, file)
  const [cookies, setCookie] = useCookies(['bookPrefs'])

  if (!repo) return null

  const localProjectDir: string = cookies.bookPrefs?.localProjectDir || ''
  const ide: string = cookies.bookPrefs?.ide || 'vscode'
  const ideLink = `${ide}://file/${localProjectDir}/${repo}/${file}`
  return (
    <div className="not-prose">
      <div className="flex gap-1 rounded bg-muted p-5">
        <Input
          value={`pnpm run ${startCommand}`}
          className="bg-background font-mono"
          readOnly
        />

        <Button asChild>
          <Link
            target="_blank"
            href={`vscode://file/${localProjectDir}/${repo}/${file}`}
          >
            Open file in your editor
          </Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="px-2.5">
              <CogIcon className="w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Local Environment Settings For Exercises
              </DialogTitle>
              <DialogDescription>
                Set local path to your book directory and protocl to open files
                directly in your IDE.
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <div className="flex flex-col gap-2">
                <Button asChild className="gap-2" variant="secondary">
                  <Link
                    href={`https://github.com/total-typescript/total-typescript-book/`}
                    target="_blank"
                  >
                    <Icon name="Github" className="w-4" /> Book GitHub
                    Repository
                  </Link>
                </Button>
                <Input
                  id="ideLink"
                  value={
                    'git clone https://github.com/total-typescript/total-typescript-book.git'
                  }
                  className="font-mono text-xs"
                  readOnly
                />
              </div>
              <hr className="mb-2 mt-5" />
              <div className="">
                <Label htmlFor="localProjectDir" className="text-right">
                  Local Project Directory*
                </Label>
                <Input
                  id="localProjectDir"
                  value={localProjectDir}
                  onChange={(event) => {
                    setCookie(
                      'bookPrefs',
                      {
                        ...cookies.bookPrefs,
                        localProjectDir: event.target.value,
                      },
                      {path: '/'},
                    )
                  }}
                  placeholder="Local Project Directory"
                />
                <div className="mt-1 flex items-center gap-1 text-sm opacity-75">
                  <InformationCircleIcon className="w-3" />
                  {'Users/username/Projects/total-typescript-book'}
                </div>
              </div>
              <div className="">
                <Label htmlFor="ide" className="text-right">
                  Protocol*
                </Label>
                <Input
                  id="ide"
                  value={ide}
                  onChange={(event) => {
                    setCookie(
                      'bookPrefs',
                      {...cookies.bookPrefs, ide: event.target.value},
                      {path: '/'},
                    )
                  }}
                  placeholder="Local Project Directory"
                />
              </div>
              <div className="">
                <Label htmlFor="ideLink" className="text-right">
                  Deep Link Preview (Read-only)
                </Label>
                <Input
                  id="ideLink"
                  value={ideLink}
                  className="font-mono text-xs"
                  readOnly
                />
                <div className="mt-1 flex items-center gap-1 text-sm opacity-75">
                  <InformationCircleIcon className="w-3" />
                  Link to open the file in your IDE
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit">Save changes</Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

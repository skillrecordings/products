import {useCopyToClipboard} from 'react-use'
import {BookmarkIcon as BookmarkIconSolid} from '@heroicons/react/solid'
import {BookmarkIcon} from '@heroicons/react/outline'
import {isBrowser} from '@/utils/is-browser'
import toast from 'react-hot-toast'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {childrenToString} from '@/utils/children-to-string'
import {trpc} from '@/trpc/trpc.client'

interface LinkedHeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  as?: Extract<
    keyof JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >
  onAddBookmark?: ({
    resourceId,
    resourceTitle,
    resourceSlug,
  }: {
    resourceId: string
    resourceTitle: string
    resourceSlug: string
  }) => Promise<void>
  appendValueForRepeatedIds?: string
  resourceId?: string
}

export const BookmarkableMarkdownHeading: React.FC<LinkedHeadingProps> = ({
  as = 'h2',
  appendValueForRepeatedIds,
  onAddBookmark,
  resourceId,
  ...props
}) => {
  let id = props.id as string
  if (id.startsWith('exercises-') && appendValueForRepeatedIds) {
    id = `${id}${appendValueForRepeatedIds}`
  }
  const [state, copyToClipboard] = useCopyToClipboard()
  const {data: resourceBookmarked} = resourceId
    ? trpc.bookmarks.getBookmark.useQuery({
        id: resourceId,
      })
    : {data: undefined}

  const deleteBookmarkMutation = trpc.bookmarks.deleteBookmark.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed')
    },
    onError: (error) => {
      toast.error('Error removing bookmark')
    },
  })
  const linkToTitle = `#${id}`
  const handleOnClick = () => {
    if (isBrowser()) {
      const url = window.location.href
      const hash = window.location.hash
      const strippedUrl = url.replace(hash, '')

      copyToClipboard(strippedUrl + linkToTitle)
      toast.success('Link copied')
    }
  }

  const H = () =>
    React.createElement(
      as,
      {
        className: 'group cursor-pointer relative pr-10',
        onClick: handleOnClick,
        ...props,
        // rehypeSlug treats ampersands as invalid characters so this is a workaround for that
        id: id.replaceAll('--', '-'),
      },
      props.children,
    )

  return (
    <span className="relative inline-flex w-full items-center">
      <span className="group relative inline-flex w-full items-center">
        <a
          href={linkToTitle}
          className="absolute left-[-2ch] translate-y-3 pr-3 !text-white/50 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-cyan-300"
          aria-hidden="true"
        >
          #
        </a>
        <H />
      </span>
      {onAddBookmark && resourceId && (
        <button
          className="absolute right-0 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-amber-300/10 p-2 transition duration-300 group-hover:bg-amber-300/20 hover:bg-amber-300/20 sm:translate-y-3"
          type="button"
          onClick={async () => {
            console.log({resourceBookmarked})
            if (resourceBookmarked) {
              deleteBookmarkMutation.mutate({id: resourceBookmarked.id})
            } else {
              await onAddBookmark({
                resourceId,
                resourceTitle: childrenToString(props.children),
                resourceSlug: props.id as string,
              })
            }
          }}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {resourceBookmarked ? (
                  <BookmarkIconSolid className="h-5 w-5 text-amber-200" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-amber-200" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground">
                {resourceBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="sr-only">Add Bookmark</span>
        </button>
      )}
    </span>
  )
}

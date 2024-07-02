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
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import type {BookChapter} from '@/lib/book'
import {cn} from '@skillrecordings/ui/utils/cn'

interface LinkedHeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  as?: Extract<
    keyof JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >
  chapter?: BookChapter
  appendValueForRepeatedIds?: string
  resourceId?: string
}

export const BookmarkableMarkdownHeading: React.FC<LinkedHeadingProps> = ({
  as = 'h2',
  appendValueForRepeatedIds,
  chapter,
  onChangeCapture,
  resourceId,
  ...props
}) => {
  let id = props.id as string
  if (id.startsWith('exercises-') && appendValueForRepeatedIds) {
    id = `${id}${appendValueForRepeatedIds}`
  }
  const {data: session} = useSession()
  const [state, copyToClipboard] = useCopyToClipboard()
  const {
    data: resourceBookmarked,
    status,
    isRefetching,
    isFetching,
  } = trpc.bookmarks.getBookmark.useQuery(
    {
      id: resourceId as string,
    },
    {
      enabled: Boolean(resourceId),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (data) => {
        if (data) {
          setOptimisticallyBookmarked(true)
        }
      },
    },
  )
  const [optimisticallyBookmarked, setOptimisticallyBookmarked] =
    React.useState(false)

  const deleteBookmarkMutation = trpc.bookmarks.deleteBookmark.useMutation({
    onMutate: async (fields) => {
      setOptimisticallyBookmarked(false)
    },
    onSuccess: () => {
      toast.success('Bookmark removed')
    },
    onError: (error) => {
      setOptimisticallyBookmarked(true)
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

  const addBookmarkMutation = trpc.bookmarks.addBookmark.useMutation({
    onMutate: async (fields) => {
      setOptimisticallyBookmarked(true)
    },
    onSuccess: (data) => {
      toast.success('Bookmark added')
    },
    onError: (error) => {
      setOptimisticallyBookmarked(false)
      if (error?.data?.httpStatus === 401) {
        toast.error('Please log in to save bookmarks')
      } else {
        toast.error('Error adding bookmark')
      }
    },
  })

  const handleAddBookmark = async ({
    resourceId,
    resourceTitle,
    resourceSlug,
  }: {
    resourceId: string
    resourceTitle: string
    resourceSlug: string
  }) => {
    return await addBookmarkMutation.mutateAsync({
      type: 'book',
      resourceId,
      fields: {
        chapterSlug: chapter?.slug as string,
        chapterTitle: chapter?.title as string,
        resourceTitle,
        resourceSlug,
      },
    })
  }

  const isBookmarkingDisabled =
    !session?.user ||
    status === 'loading' ||
    isRefetching ||
    isFetching ||
    addBookmarkMutation.isLoading ||
    deleteBookmarkMutation.isLoading

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
      {resourceId && (
        <button
          className={cn(
            'absolute right-0 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-amber-300/10 p-2 transition duration-300 sm:translate-y-3',
            {
              'cursor-wait': isBookmarkingDisabled,
              'group-hover:bg-amber-300/20 hover:bg-amber-300/20':
                !isBookmarkingDisabled,
            },
          )}
          type="button"
          disabled={isBookmarkingDisabled}
          onClick={async () => {
            if (!session?.user) return

            if (resourceBookmarked) {
              deleteBookmarkMutation.mutate({id: resourceBookmarked.id})
            } else {
              await handleAddBookmark({
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
                {optimisticallyBookmarked ? (
                  <BookmarkIconSolid className="h-5 w-5 text-amber-200" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-amber-200" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground">
                {session?.user ? (
                  resourceBookmarked ? (
                    'Remove bookmark'
                  ) : (
                    'Add bookmark'
                  )
                ) : (
                  <span>
                    <Link href="/login">Log in</Link> to bookmark
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="sr-only">Add Bookmark</span>
        </button>
      )}
    </span>
  )
}

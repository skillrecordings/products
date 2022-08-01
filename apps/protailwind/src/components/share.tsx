import {
  getShareUrl,
  useCopyToClipboard,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  LinkIcon,
  LinkedInIcon,
} from '@skillrecordings/react'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {ChevronDownIcon} from '@heroicons/react/solid'

const Share: React.FC<{title: string}> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const message = `${title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const dropDownItemCss =
    'group w-full flex items-center gap-2 hover:bg-white/10 pl-3 pr-5 py-1 cursor-pointer'
  const iconCss =
    'w-4 h-4 text-slate-300 group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition'
  const {copyToClipboard} = useCopyToClipboard(url)
  return (
    <DropdownMenu.Root data-sr-share-dropdown="">
      <DropdownMenu.Trigger className="rounded-md bg-gradient-to-t from-yellow-500/90 via-yellow-500 to-yellow-500 shadow text-slate-900 pl-3 pr-2 pt-2 pb-2.5 flex items-center gap-2">
        Share <span className="md:inline-block hidden">on</span>
        <ChevronDownIcon className="w-4 h-4 text-yellow-900 mt-1" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className=" bg-slate-900 contrast-125 rounded-md border border-black"
          loop
        >
          <DropdownMenu.Group className="w-full">
            {/* <DropdownMenu.Label className="px-2 py-1">
                On social media
              </DropdownMenu.Label> */}
            <DropdownMenu.Item
              className={dropDownItemCss}
              textValue="Twitter"
              onSelect={(e) => {
                e.preventDefault()
                window.open(getShareUrl('twitter', url, message), '_blank')
              }}
            >
              <TwitterIcon className={iconCss} />
              Twitter
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={dropDownItemCss}
              onSelect={(e) => {
                e.preventDefault()
                window.open(getShareUrl('linkedin', url), '_blank')
              }}
            >
              <LinkedInIcon className={iconCss} />
              LinkedIn
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={dropDownItemCss}
              onSelect={(e) => {
                e.preventDefault()
                window.open(getShareUrl('reddit', url), '_blank')
              }}
            >
              <RedditIcon className={iconCss} />
              Reddit
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={dropDownItemCss}
              onSelect={(e) => {
                e.preventDefault()
                window.open(getShareUrl('facebook', url), '_blank')
              }}
            >
              <FacebookIcon className={iconCss} />
              Facebook
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Item
            className={dropDownItemCss}
            onSelect={(e) => {
              e.preventDefault()
              copyToClipboard()
              toast.success('Copied to clipboard')
            }}
          >
            <LinkIcon className={iconCss} />
            Copy url
          </DropdownMenu.Item>

          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default Share

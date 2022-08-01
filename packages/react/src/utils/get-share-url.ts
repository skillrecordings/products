import {shareLinks} from '../components/share-links'

type platforms = 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'hacker'

export const getShareUrl = (
  type: platforms,
  link: string,
  message?: string,
) => {
  switch (type) {
    case 'twitter':
      return shareLinks.twitter(
        link,
        message || `@${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`,
      )
    case 'facebook':
      return shareLinks.facebook(link)
    case 'reddit':
      return shareLinks.reddit(link, message)
    case 'linkedin':
      return shareLinks.linkedin(link)
    case 'linkedin':
      return shareLinks.linkedin(link)
  }
}

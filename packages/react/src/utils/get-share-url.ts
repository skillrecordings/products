type platforms = 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'hacker'

export const shareLinks = {
  twitter: (link = '', message = '') =>
    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message,
    )}&url=${encodeURIComponent(link)}`,
  facebook: (link = '') =>
    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  reddit: (link = '', message = '') =>
    `https://reddit.com/submit/?url=${encodeURIComponent(
      link,
    )}&title=${encodeURIComponent(message)}`,
  linkedin: (link = '') =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      link,
    )}`,
  hacker: (link = '', message = '') =>
    `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
      link,
    )}&t=${encodeURIComponent(message)}`,
}

export const getShareUrl = (
  type: platforms,
  link: string,
  message?: string,
) => {
  switch (type) {
    case 'twitter':
      return shareLinks.twitter(
        link,
        message ? message : `@${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`,
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

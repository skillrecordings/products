export const isBrowser = () => typeof window !== 'undefined'

export const isFirefox =
  isBrowser() && window?.navigator?.userAgent?.includes('Firefox')

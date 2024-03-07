export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3021}` // dev SSR should use localhost
}

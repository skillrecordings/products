import {z} from 'zod'

const envVariables = z.object({
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXT_PUBLIC_SITE_TITLE: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_PARTNER_FIRST_NAME: z.string(),
  NEXT_PUBLIC_PARTNER_LAST_NAME: z.string(),
  NEXT_PUBLIC_PARTNER_TWITTER: z.string(),
  NEXT_PUBLIC_SEO_KEYWORDS: z.string(),
  NEXT_PUBLIC_PRODUCT_DESCRIPTION: z.string(),
  NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM: z.string(),
  NEXT_PUBLIC_CONVERTKIT_TOKEN: z.string(),
  NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY: z.string(),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string(),
  CONVERTKIT_BASE_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string(),
  NEXT_PUBLIC_DEFAULT_OG_IMAGE_URL: z.string(),
  EMAIL_SERVER_HOST: z.string(),
  EMAIL_SERVER_PORT: z.number(),
  POSTMARK_KEY: z.string(),
  NEXT_PUBLIC_PRODUCT_NAME: z.string(),
  STRIPE_SECRET_TOKEN: z.string(),
  SANITY_IMPORT_DATA_FILE_PATH: z.string(),
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
